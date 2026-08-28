'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Input,
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from 'packages/ui'
import {
    Check,
    Hash,
    Info,
    Link2,
    Menu,
    Plus,
    Send,
    Smile,
    Pin,
    Image,
    MoreHorizontal,
    Pencil,
    Trash2,
    Gift,
    X,
    Sticker as StickerIcon,
    Loader2,
    Users,
} from 'lucide-react'
import { api, getAvatarUrl, socket } from '@zerozone/lib'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import MessageText from '../../../../_components/chat/MessageText'
import { ChatBackgroundPattern } from '../../../../_components/chat/ChatBackgroundPattern'
import { insertAtCursor } from '../../../../_components/chat/insertAtCursor'
import { MembersSidebarContent } from '../../../../_components/zones/MembersSidebar'
import ZoneSettings from '../../../../_components/zones/ZoneSettings'
import ZoneSidebar from '../../../../_components/ZoneSidebar'
import ZonesList from '../../../../_components/zones/ZonesList'
const GifPicker = dynamic(() => import('../../../../_components/chat/GifPicker'), { ssr: false })
const EmojiPicker = dynamic(() => import('../../../../_components/chat/EmojiPicker'), { ssr: false })
const StickerPicker = dynamic(() => import('../../../../_components/chat/StickerPicker'), { ssr: false })
import { useChatsStore } from '@/app/stores/chat-store'
import {
    useSendChannelMessageMutation,
    useEditChannelMessageMutation,
    useDeleteChannelMessageMutation,
} from '@/features/chat/mutations'
import { useChannelPinnedMessages } from '@/features/chat/queries'
import { useChatQuery } from '@/features/chat/useChatQuery'
import { useChatSocket } from '@/features/chat/useChatSocket'
import { useChannel } from '@/features/channels/queries'
import { useCreateZoneInviteMutation } from '@/features/zones/mutations'
import { useZone } from '@/features/zones/queries'
import { useUser } from '@/features/user/queries'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'packages/ui'

function getMessageTimestamp(message: { createdAt?: string; id: number }) {
    if (message.createdAt) {
        const parsed = new Date(message.createdAt).getTime()
        if (!Number.isNaN(parsed)) return parsed
    }

    return message.id
}

type ChannelMessage = {
    id: number
    text?: string | null
    fileUrl?: string | null
    fileType?: string | null
    senderId: number
    sender?: { id: number; username: string; avatar?: string | null } | null
    createdAt: string
    isDeleted?: boolean
    isPinned?: boolean
    pinnedAt?: string | null
}

export default function ChannelPage() {
    const { zonePublicId, channelPublicId } = useParams<{
        zonePublicId: string
        channelPublicId: string
    }>()
    const { data: currentUser } = useUser()
    const { data: zone, isLoading: zoneLoading } = useZone(zonePublicId)
    const { data: channel, isLoading: channelLoading } = useChannel(
        zonePublicId,
        channelPublicId
    )
    const {
        data: messages = [],
        isLoading: messagesLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useChatQuery(zonePublicId, channelPublicId)

    useChatSocket(zonePublicId, channelPublicId)
    const { data: pinnedMessages = [] } = useChannelPinnedMessages(
        zonePublicId,
        channelPublicId
    )
    const sendMessageMutation = useSendChannelMessageMutation(
        zonePublicId,
        channelPublicId
    )
    const editMessageMutation = useEditChannelMessageMutation(
        zonePublicId,
        channelPublicId
    )
    const deleteMessageMutation = useDeleteChannelMessageMutation(
        zonePublicId,
        channelPublicId
    )
    const createZoneInviteMutation = useCreateZoneInviteMutation(zonePublicId)

    const [input, setInput] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [inviteCopied, setInviteCopied] = useState(false)
    const [dashboardOpen, setDashboardOpen] = useState(false)
    const [showGifs, setShowGifs] = useState(false)
    const [showEmojis, setShowEmojis] = useState(false)
    const [showStickers, setShowStickers] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editText, setEditText] = useState('')
    const [pinnedPanelOpen, setPinnedPanelOpen] = useState(false)
    const [membersOpen, setMembersOpen] = useState(false)
    const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set())

    const messagesRef = useRef<HTMLDivElement>(null)
    const topSentinelRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const setActiveChat = useChatsStore((state) => state.setActiveChat)
    const setActiveChannel = useChatsStore((state) => state.setActiveChannel)
    const clearUnread = useChatsStore((state) => state.clearUnread)

    useEffect(() => {
        setActiveChat(zonePublicId)
        setActiveChannel(channelPublicId)
        clearUnread(zonePublicId, channelPublicId)

        return () => {
            setActiveChat(null)
            setActiveChannel(null)
        }
    }, [
        channelPublicId,
        clearUnread,
        setActiveChannel,
        setActiveChat,
        zonePublicId,
    ])

    useEffect(() => {
        socket.emit('join-room', {
            chatPublicId: zonePublicId,
            channelPublicId,
        })

        return () => {
            socket.emit('leave-room', {
                chatPublicId: zonePublicId,
                channelPublicId,
            })
        }
    }, [channelPublicId, zonePublicId])

    useEffect(() => {
        const handler = ({
            userId,
            isTyping,
        }: {
            userId: number
            isTyping: boolean
        }) => {
            setTypingUsers((prev) => {
                const next = new Set(prev)
                if (isTyping) next.add(userId)
                else next.delete(userId)
                return next
            })
        }
        socket.on('chat:typing', handler)
        return () => {
            socket.off('chat:typing', handler)
        }
    }, [])

    useEffect(() => {
        if (!messagesRef.current) return

        const container = messagesRef.current
        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight

        if (distanceFromBottom < 160) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: messagesLoading || isFetchingNextPage ? 'auto' : 'smooth',
            })
        }
    }, [messages.length, messagesLoading, isFetchingNextPage])

    const clearSelectedFile = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        setSelectedFile(null)
        setPreviewUrl(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [previewUrl])

    const copyInviteLink = useCallback(async () => {
        const invite = await createZoneInviteMutation.mutateAsync()
        const link = `${window.location.origin}/zone/invite/${invite.code}`

        await navigator.clipboard.writeText(link)
        setInviteCopied(true)
        window.setTimeout(() => setInviteCopied(false), 2000)
    }, [createZoneInviteMutation])

    const send = useCallback(async () => {
        if (!input.trim() && !selectedFile) return

        await sendMessageMutation.mutateAsync({
            text: input,
            file: selectedFile,
            previewUrl,
        })

        setInput('')
        clearSelectedFile()
    }, [
        clearSelectedFile,
        input,
        previewUrl,
        selectedFile,
        sendMessageMutation,
    ])

    const handlePinMessage = useCallback(async (messageId: number) => {
        await api(`/chats/messages/${messageId}/pin`, {
            method: 'PATCH',
            credentials: 'include',
        })
    }, [])

    const handleEditMessage = useCallback(
        async (messageId: number) => {
            if (!editText.trim()) return
            await editMessageMutation.mutateAsync({
                messageId,
                text: editText,
            })
            setEditingId(null)
            setEditText('')
        },
        [editText, editMessageMutation]
    )

    const handleDeleteMessage = useCallback(
        async (messageId: number) => {
            await deleteMessageMutation.mutateAsync(messageId)
        },
        [deleteMessageMutation]
    )

    const startEditing = useCallback(
        (
            message: Omit<ChannelMessage, 'createdAt'> & { createdAt?: string }
        ) => {
            setEditingId(message.id)
            setEditText(message.text || '')
        },
        []
    )

    const emitTyping = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        socket.emit('chat:typing', {
            chatPublicId: zonePublicId,
            channelPublicId,
            isTyping: true,
        })
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('chat:typing', {
                chatPublicId: zonePublicId,
                channelPublicId,
                isTyping: false,
            })
            typingTimeoutRef.current = null
        }, 3000)
    }, [channelPublicId, zonePublicId])

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!topSentinelRef.current || !hasNextPage) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage()
                }
            },
            { root: messagesRef.current, rootMargin: '200px' },
        )

        observer.observe(topSentinelRef.current)

        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const scrollToMessage = useCallback((messageId: number) => {
        const element = document.getElementById(`message-${messageId}`)
        if (!element) return
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [])

    if (zoneLoading || channelLoading || messagesLoading || !zone || !channel) {
        return (
            <div className="relative flex h-full min-h-0 flex-col bg-background">
                <ChatBackgroundPattern />
                <div className="relative z-10 h-12 shrink-0 border-b border-border bg-background" />
                <div className="relative z-10 flex flex-1 min-h-0 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary/60" />
                </div>
            </div>
        )
    }

    const currentUserId = currentUser?.id

    return (
        <div className="relative flex h-full min-h-0 flex-col bg-background">
            <ChatBackgroundPattern />
            <div className="relative z-10 h-12 shrink-0 border-b border-border flex items-center px-4 justify-between shadow-sm bg-background">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="md:hidden shrink-0">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                                    <Menu className="h-5 w-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[336px] p-0">
                                <VisuallyHidden>
                                    <SheetTitle>Navigation</SheetTitle>
                                </VisuallyHidden>
                                <div className="flex h-full w-full">
                                    <ZonesList />
                                    <ZoneSidebar user={currentUser ?? null} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Hash className="w-5 h-5 text-muted-foreground shrink-0" />
                    <h1 className="font-bold text-sm tracking-tight truncate min-w-0">
                        {channel.name}
                    </h1>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {pinnedMessages.length > 0 && (
                        <button
                            type="button"
                            className="hidden sm:flex items-center gap-1 text-[11px] text-amber-500 hover:underline"
                            onClick={() => setPinnedPanelOpen(true)}
                        >
                            <Pin className="h-3 w-3" />
                            {pinnedMessages.length} pinned
                        </button>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setMembersOpen(true)}
                        className="h-8 w-8 lg:hidden"
                        title="Members"
                    >
                        <Users size={18} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            void copyInviteLink()
                        }}
                        disabled={createZoneInviteMutation.isPending}
                        className="h-8 w-8"
                        title="Copy invite link"
                    >
                        {inviteCopied ? (
                            <Check size={18} />
                        ) : (
                            <Link2 size={18} />
                        )}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDashboardOpen(true)}
                        className="h-8 w-8"
                    >
                        <Info size={18} />
                    </Button>
                </div>
            </div>

            <Sheet open={membersOpen} onOpenChange={setMembersOpen}>
                <SheetContent side="right" className="w-80 p-0 border-white/5">
                    <VisuallyHidden>
                        <SheetTitle>Members</SheetTitle>
                    </VisuallyHidden>
                    <MembersSidebarContent />
                </SheetContent>
            </Sheet>

            <Sheet open={pinnedPanelOpen} onOpenChange={setPinnedPanelOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetTitle>Pinned Messages</SheetTitle>
                    <SheetDescription>
                        Quick access to the most important messages in this
                        channel.
                    </SheetDescription>

                    <div className="mt-6 space-y-3">
                        {pinnedMessages.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No pinned messages yet.
                            </p>
                        )}
                        {pinnedMessages.map((m) => (
                            <div
                                key={m.id}
                                className="p-3 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => scrollToMessage(m.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage
                                            src={getAvatarUrl(m.sender?.avatar)}
                                        />
                                        <AvatarFallback className="text-[10px]">
                                            {m.sender?.username[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium">
                                        {m.sender?.username}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(
                                            getMessageTimestamp(m)
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm mt-1 line-clamp-2">
                                    {m.isDeleted ? (
                                        <span className="italic text-muted-foreground">
                                            Message deleted
                                        </span>
                                    ) : m.text ? (
                                        <MessageText text={m.text} />
                                    ) : m.fileUrl ? (
                                        <span className="text-muted-foreground">
                                            Sent an image
                                        </span>
                                    ) : null}
                                </p>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            {zone && (
                <ZoneSettings
                    zonePublicId={zonePublicId}
                    zoneName={zone.name}
                    zoneAvatar={zone.avatar}
                    open={dashboardOpen}
                    onOpenChange={setDashboardOpen}
                />
            )}

            <div
                ref={messagesRef}
                className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-4 space-y-4"
            >
                <div className="flex flex-col min-h-full justify-end">
                    <div ref={topSentinelRef} className="h-1" />

                    {isFetchingNextPage && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-primary/60" />
                        </div>
                    )}

                    <div className="px-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Hash size={32} />
                        </div>
                        {channel && (
                            <>
                                <h2 className="text-2xl font-bold mb-1">
                                    Welcome to #{channel.name}!
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    This is the start of the #{channel.name}{' '}
                                    channel.
                                </p>
                            </>
                        )}
                        <div className="h-[1px] bg-border w-full my-6" />
                    </div>

                    {messages.map((message, index) => {
                        const previousMessage = messages[index - 1]
                        const isGrouped =
                            !!previousMessage &&
                            previousMessage.senderId === message.senderId &&
                            getMessageTimestamp(message) -
                                getMessageTimestamp(previousMessage) <
                                300000

                        const sender = message.sender || {
                            username: 'User',
                            avatar: null,
                        }
                        const isOwn = message.senderId === currentUserId

                        if (isGrouped) {
                            return (
                                <div
                                    key={message.id}
                                    id={`message-${message.id}`}
                                    className="pl-14 pr-4 py-0.5 hover:bg-muted/30 transition-colors group relative"
                                >
                                    <div className="text-[14px] leading-[1.375rem]">
                                        {message.isDeleted ? (
                                            <span className="italic text-muted-foreground">
                                                Message deleted
                                            </span>
                                        ) : message.text ? (
                                            editingId === message.id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={editText}
                                                        onChange={(e) =>
                                                            setEditText(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-8"
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                'Enter'
                                                            )
                                                                handleEditMessage(
                                                                    message.id
                                                                )
                                                            if (
                                                                e.key ===
                                                                'Escape'
                                                            )
                                                                setEditingId(
                                                                    null
                                                                )
                                                        }}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditMessage(
                                                                message.id
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            ) : (
                                                <MessageText
                                                    text={message.text}
                                                />
                                            )
                                        ) : null}
                                    </div>
                                    {message.fileUrl && (
                                        <img
                                            src={message.fileUrl}
                                            className="mt-2 rounded-lg max-h-80 ring-1 ring-border"
                                        />
                                    )}
                                </div>
                            )
                        }

                        return (
                            <div
                                key={message.id}
                                id={`message-${message.id}`}
                                className="flex gap-4 px-4 py-3 hover:bg-muted/30 transition-colors mt-2 group"
                            >
                                <Avatar className="h-10 w-10 shrink-0 mt-0.5">
                                    <AvatarImage
                                        src={getAvatarUrl(sender.avatar)}
                                    />
                                    <AvatarFallback>
                                        {sender.username[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                        <span className="font-bold text-[15px] hover:underline cursor-pointer">
                                            {sender.username}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {new Date(
                                                getMessageTimestamp(message)
                                            ).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        {message.isPinned && (
                                            <Pin className="h-3 w-3 text-amber-500" />
                                        )}
                                    </div>
                                    <div className="text-[14px] leading-[1.375rem] whitespace-pre-wrap break-words">
                                        {message.isDeleted ? (
                                            <span className="italic text-muted-foreground">
                                                Message deleted
                                            </span>
                                        ) : editingId === message.id ? (
                                            <div className="flex gap-2">
                                                <Input
                                                    value={editText}
                                                    onChange={(e) =>
                                                        setEditText(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-8"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter')
                                                            handleEditMessage(
                                                                message.id
                                                            )
                                                        if (e.key === 'Escape')
                                                            setEditingId(null)
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditMessage(
                                                            message.id
                                                        )
                                                    }
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        ) : message.text ? (
                                            <MessageText text={message.text} />
                                        ) : null}
                                    </div>
                                    {message.fileUrl && (
                                        <img
                                            src={message.fileUrl}
                                            className="mt-2 rounded-lg max-h-80 ring-1 ring-border"
                                        />
                                    )}
                                </div>

                                {!message.isDeleted && isOwn && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        startEditing(message)
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteMessage(
                                                            message.id
                                                        )
                                                    }
                                                    className="cursor-pointer text-red-500 focus:text-red-500"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handlePinMessage(
                                                            message.id
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <Pin className="mr-2 h-4 w-4" />
                                                    {message.isPinned
                                                        ? 'Unpin'
                                                        : 'Pin'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {typingUsers.size > 0 &&
                        Array.from(typingUsers).map((uid) => {
                            const user = messages.find(
                                (m) => m.senderId === uid
                            )?.sender
                            if (!user) return null
                            return (
                                <div key={uid} className="px-4 py-1">
                                    <span className="text-xs text-muted-foreground animate-pulse">
                                        {user.username} is typing...
                                    </span>
                                </div>
                            )
                        })}
                </div>
            </div>

            <div
                className="relative z-10 shrink-0 border-t border-white/5 bg-background/95 px-2 pt-2 safe-bottom backdrop-blur"
                style={{
                    paddingBottom:
                        'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
                }}
            >
                {showGifs && (
                    <div className="mb-2">
                        <GifPicker
                            onSelect={(gifUrl) => {
                                void sendMessageMutation
                                    .mutateAsync({ stickerUrl: gifUrl })
                                    .catch(() => {})
                                setShowGifs(false)
                                inputRef.current?.focus()
                            }}
                            onClose={() => setShowGifs(false)}
                        />
                    </div>
                )}

                {showEmojis && (
                    <div className="mb-2">
                        <EmojiPicker
                            onSelect={(emoji) => {
                                if (inputRef.current) {
                                    insertAtCursor(inputRef.current, emoji, setInput)
                                    inputRef.current?.focus()
                                } else {
                                    setInput((prev) => prev + emoji)
                                }
                            }}
                            onClose={() => setShowEmojis(false)}
                        />
                    </div>
                )}

                {showStickers && (
                    <div className="mb-2">
                        <StickerPicker
                            onClose={() => setShowStickers(false)}
                            onSelect={(url) => {
                                void sendMessageMutation
                                    .mutateAsync({ stickerUrl: url })
                                    .catch(() => {})
                                setShowStickers(false)
                                inputRef.current?.focus()
                            }}
                        />
                    </div>
                )}

                {previewUrl && (
                    <div className="px-4 mb-2">
                        <div className="absolute bottom-20 left-2 w-fit bg-background rounded-2xl p-2 shadow-md">
                            <img
                                src={previewUrl}
                                className="max-h-40 rounded-xl object-cover"
                                alt="Preview"
                            />
                            <button
                                onClick={clearSelectedFile}
                                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                            >
                                <span className="sr-only">Remove</span>
                                <X />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-1.5 px-3 py-2 bg-background/50 rounded-2xl border border-white/5 relative">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-zinc-400 hover:text-zinc-200 shrink-0 h-9 w-9"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>

                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(event) => {
                            setInput(event.target.value)
                            emitTyping()
                        }}
                        placeholder={`Message #${channel.name}`}
                        className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-zinc-500 min-w-0"
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault()
                                void send()
                            }
                        }}
                    />

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setShowGifs(!showGifs); setShowEmojis(false); setShowStickers(false) }}
                        className={`h-9 w-9 shrink-0 transition-colors hidden sm:inline-flex ${showGifs ? 'text-primary' : 'text-zinc-400 hover:text-zinc-200'}`}
                        title="Send GIF"
                    >
                        <Gift className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setShowEmojis(!showEmojis); setShowGifs(false); setShowStickers(false) }}
                        className={`h-9 w-9 shrink-0 transition-colors ${showEmojis ? 'text-primary' : 'text-zinc-400 hover:text-zinc-200'}`}
                        title="Pick an Emoji"
                    >
                        <Smile className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setShowStickers(!showStickers); setShowGifs(false); setShowEmojis(false) }}
                        className={`h-9 w-9 shrink-0 transition-colors hidden sm:inline-flex ${showStickers ? 'text-primary' : 'text-zinc-400 hover:text-zinc-200'}`}
                        title="Custom Stickers"
                    >
                        <StickerIcon className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        disabled={
                            (!input.trim() && !selectedFile) ||
                            sendMessageMutation.isPending
                        }
                        onClick={() => {
                            void send()
                        }}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 w-9 flex-shrink-0 ml-1"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return

                        if (previewUrl) {
                            URL.revokeObjectURL(previewUrl)
                        }

                        setSelectedFile(file)
                        setPreviewUrl(URL.createObjectURL(file))
                    }}
                />
            </div>
        </div>
    )
}
