import assert from 'node:assert/strict'
import { buildMessagePayload, hasMessageContent } from './messagePayload'

const gifUrl = 'https://cdn.example.com/sticker.gif'

assert.equal(
    hasMessageContent({ stickerUrl: gifUrl }),
    true,
    'media-only messages should be sendable'
)

assert.deepEqual(
    buildMessagePayload({
        chatPublicId: 'chat_123',
        text: '',
        stickerUrl: gifUrl,
    }),
    {
        chatPublicId: 'chat_123',
        text: null,
        fileUrl: gifUrl,
        fileType: 'image/gif',
    },
    'media URLs should be sent as file metadata, not text'
)

assert.deepEqual(
    buildMessagePayload({
        chatPublicId: 'chat_123',
        channelPublicId: 'channel_456',
        text: '  hello  ',
    }),
    {
        chatPublicId: 'chat_123',
        channelPublicId: 'channel_456',
        text: 'hello',
        fileUrl: null,
        fileType: null,
    },
    'text messages should be trimmed before sending'
)
