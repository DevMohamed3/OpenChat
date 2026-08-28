import type { SendChannelMessageInput } from './types'

export type UploadedMessageFile = {
    fileUrl: string
    fileType: string
}

export type MessagePayloadInput = SendChannelMessageInput & {
    chatPublicId: string
    channelPublicId?: string
}

export function hasMessageContent({ text, file, stickerUrl }: SendChannelMessageInput) {
    return Boolean(text?.trim() || file || stickerUrl)
}

export function buildMessagePayload(
    { chatPublicId, channelPublicId, text, file, stickerUrl }: MessagePayloadInput,
    uploadedFile: UploadedMessageFile | null = null
) {
    const nextText = text?.trim() ?? ''

    return {
        chatPublicId,
        ...(channelPublicId ? { channelPublicId } : {}),
        text: nextText || null,
        fileUrl: stickerUrl ?? uploadedFile?.fileUrl ?? null,
        fileType: stickerUrl
            ? 'image/gif'
            : (uploadedFile?.fileType ?? file?.type ?? null),
    }
}
