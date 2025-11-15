import ChatPage from "web/pages/chat/ChatPage"

function App() {
  return (
   <div className="h-screen bg-background text-foreground overflow-hidden">
      <main className="h-full flex flex-col">
        <ChatPage />
      </main>
    </div>
  )
}

export default App
