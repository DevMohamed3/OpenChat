import { useMutation, useQueryClient } from "@tanstack/react-query"
import { socket } from "@zerozone/lib"
import { apiClient } from "@/lib/api/client"
import { mergeIntoFirstPage, updateInAllPages, messageKeys, type ChatMessagePage } from "@/features/chat/queries"
import type { ChannelMessage, SendChannelMessageInput } from "@/features/chat/types"
import { useUser } from "@/features/user/queries"
import type { InfiniteData } from "@tanstack/react-query"
import { buildMessagePayload, hasMessageContent, type UploadedMessageFile } from "./messagePayload"

type StartChatResponse = {
  chatPublicId: string
}

type UploadResponse = UploadedMessageFile

function emitChannelMessage(message: {
  chatPublicId: string
  channelPublicId: string
  text: string | null
  fileUrl?: string | null
  fileType?: string | null
}) {
  return new Promise<ChannelMessage>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Timed out while sending message"))
    }, 10_000)

    socket.emit("private-message", message, (savedMessage: ChannelMessage | undefined) => {
      window.clearTimeout(timer)

      if (!savedMessage || typeof savedMessage.id !== "number") {
        reject(new Error("Message could not be confirmed by the server"))
        return
      }

      resolve(savedMessage)
    })
  })
}

function emitDirectMessage(message: {
  chatPublicId: string
  text: string | null
  fileUrl?: string | null
  fileType?: string | null
}) {
  return new Promise<ChannelMessage>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Timed out while sending message"))
    }, 10_000)

    socket.emit("private-message", message, (savedMessage: ChannelMessage | undefined) => {
      window.clearTimeout(timer)

      if (!savedMessage || typeof savedMessage.id !== "number") {
        reject(new Error("Message could not be confirmed by the server"))
        return
      }

      resolve(savedMessage)
    })
  })
}

export function useStartDirectMessageMutation() {
  return useMutation({
    mutationFn: async (friendId: number) => {
      const data = await apiClient.post<StartChatResponse>("/chats/start", { friendId })
      return data.chatPublicId
    },
  })
}

export function useSendChannelMessageMutation(chatPublicId: string, channelPublicId: string) {
  const queryClient = useQueryClient()
  const { data: currentUser } = useUser()

  return useMutation({
    mutationFn: async ({ text, file, stickerUrl }: SendChannelMessageInput) => {
      if (!hasMessageContent({ text, file, stickerUrl })) {
        throw new Error("Message content is empty")
      }

      let uploadedFile: UploadResponse | null = null

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        uploadedFile = await apiClient.post<UploadResponse>(`/zones/${chatPublicId}/upload`, formData)
      }

      return emitChannelMessage(buildMessagePayload({
        chatPublicId,
        channelPublicId,
        text,
        file,
        stickerUrl,
      }, uploadedFile))
    },
    onMutate({ file, previewUrl, stickerUrl, text }) {
      const temporaryId = -Date.now()
      const optimisticPayload = buildMessagePayload({
        chatPublicId,
        channelPublicId,
        text,
        file,
        stickerUrl,
      })
      const previousMessages = queryClient.getQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, channelPublicId),
      )

      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, channelPublicId),
        (current) =>
          mergeIntoFirstPage(current, {
            id: temporaryId,
            chatPublicId,
            channelPublicId,
            text: optimisticPayload.text,
            senderId: currentUser?.id ?? -1,
            sender: currentUser
              ? {
                  id: currentUser.id,
                  username: currentUser.username,
                  avatar: currentUser.avatar ?? null,
                }
              : undefined,
            fileUrl: previewUrl ?? optimisticPayload.fileUrl,
            fileType: optimisticPayload.fileType,
            createdAt: new Date().toISOString(),
          }),
      )

      return { previousMessages, temporaryId }
    },
    onError(_error, _variables, context) {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          messageKeys.list(chatPublicId, channelPublicId),
          context.previousMessages,
        )
      }
    },
    onSuccess(message, _variables, context) {
      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, channelPublicId),
        (current) => {
          if (!current) return current

          const firstPage = current.pages[0] ?? { messages: [] }
          const withoutOptimistic = firstPage.messages.filter(
            (item) => item.id !== context?.temporaryId,
          )

          const updatedFirstPage = { messages: [...withoutOptimistic, message] }
          const restPages = current.pages.slice(1)

          return {
            pages: [updatedFirstPage, ...restPages],
            pageParams: current.pageParams,
          }
        },
      )
    },
  })
}

export function useSendDirectMessageMutation(chatPublicId: string) {
  const queryClient = useQueryClient()
  const { data: currentUser } = useUser()

  return useMutation({
    mutationFn: async ({ text, file, stickerUrl }: SendChannelMessageInput) => {
      if (!hasMessageContent({ text, file, stickerUrl })) {
        throw new Error("Message content is empty")
      }

      let uploadedFile: UploadResponse | null = null

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        uploadedFile = await apiClient.post<UploadResponse>(`/chats/${chatPublicId}/upload`, formData)
      }

      return emitDirectMessage(buildMessagePayload({
        chatPublicId,
        text,
        file,
        stickerUrl,
      }, uploadedFile))
    },
    onMutate({ file, previewUrl, stickerUrl, text }) {
      const temporaryId = -Date.now()
      const optimisticPayload = buildMessagePayload({
        chatPublicId,
        text,
        file,
        stickerUrl,
      })
      const previousMessages = queryClient.getQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, chatPublicId),
      )

      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, chatPublicId),
        (current) =>
          mergeIntoFirstPage(current, {
            id: temporaryId,
            chatPublicId,
            text: optimisticPayload.text,
            senderId: currentUser?.id ?? -1,
            sender: currentUser
              ? {
                  id: currentUser.id,
                  username: currentUser.username,
                  avatar: currentUser.avatar ?? null,
                }
              : undefined,
            fileUrl: previewUrl ?? optimisticPayload.fileUrl,
            fileType: optimisticPayload.fileType,
            createdAt: new Date().toISOString(),
          }),
      )

      return { previousMessages, temporaryId }
    },
    onError(_error, _variables, context) {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          messageKeys.list(chatPublicId, chatPublicId),
          context.previousMessages,
        )
      }
    },
    onSuccess(message, _variables, context) {
      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, chatPublicId),
        (current) => {
          if (!current) return current

          const firstPage = current.pages[0] ?? { messages: [] }
          const withoutOptimistic = firstPage.messages.filter(
            (item) => item.id !== context?.temporaryId,
          )

          const updatedFirstPage = { messages: [...withoutOptimistic, message] }
          const restPages = current.pages.slice(1)

          return {
            pages: [updatedFirstPage, ...restPages],
            pageParams: current.pageParams,
          }
        },
      )
    },
  })
}

export function useEditChannelMessageMutation(chatPublicId: string, channelPublicId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, text }: { messageId: number; text: string }) => {
      const data = await apiClient.patch<{ message: ChannelMessage }>(`/chats/messages/${messageId}`, {
        text,
      })
      return data.message
    },
    onSuccess(message) {
      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, channelPublicId),
        (current) => updateInAllPages(current, message.id, () => message),
      )
    },
  })
}

export function useDeleteChannelMessageMutation(chatPublicId: string, channelPublicId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: number) => {
      await apiClient.delete(`/chats/messages/${messageId}`)
      return messageId
    },
    onSuccess(messageId) {
      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, channelPublicId),
        (current) =>
          updateInAllPages(current, messageId, (m) => ({
            ...m,
            isDeleted: true,
            text: null,
          })),
      )
    },
  })
}

export function useEditDirectMessageMutation(chatPublicId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, text }: { messageId: number; text: string }) => {
      const data = await apiClient.patch<{ message: ChannelMessage }>(`/chats/messages/${messageId}`, {
        text,
      })
      return data.message
    },
    onSuccess(message) {
      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, chatPublicId),
        (current) => updateInAllPages(current, message.id, () => message),
      )
    },
  })
}

export function useDeleteDirectMessageMutation(chatPublicId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: number) => {
      await apiClient.delete(`/chats/messages/${messageId}`)
      return messageId
    },
    onSuccess(messageId) {
      queryClient.setQueryData<InfiniteData<ChatMessagePage>>(
        messageKeys.list(chatPublicId, chatPublicId),
        (current) =>
          updateInAllPages(current, messageId, (m) => ({
            ...m,
            isDeleted: true,
            text: null,
          })),
      )
    },
  })
}
