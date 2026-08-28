type InputLike = HTMLInputElement | HTMLTextAreaElement

export function insertAtCursor(
    input: InputLike,
    text: string,
    setValue: (updater: (prev: string) => string) => void
) {
    // Inputs keep their last caret position when focus moves away (e.g. to
    // the emoji picker), so trust selectionStart regardless of focus.
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start

    setValue((prev) => prev.slice(0, start) + text + prev.slice(end))

    const caret = start + text.length
    requestAnimationFrame(() => {
        input.focus()
        if (input.selectionStart !== null) {
            input.setSelectionRange(caret, caret)
        }
    })
}
