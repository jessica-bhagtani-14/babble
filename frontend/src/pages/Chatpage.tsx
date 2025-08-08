import { useState } from "react"
import Chatbox from "./chat/components/Chatbox"
import MyChats from "./chat/components/MyChats"
import { useUserStore } from "../state/userStore"
import { useChatStore } from "../state/chatStore"
import { Navbar } from "@/components/shared/Navbar"

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const user = useUserStore((s) => s.user)
  const { selectedChat } = useChatStore()

  return (
    <div className="container mx-auto max-w-7xl relative min-h-screen">
      <div className="relative z-10">
        <Navbar />
        <div className="flex h-[calc(100vh-70px)] sm:h-[calc(100vh-80px)] max-w-7xl mx-auto">
          {user && (
            <>
              {/* Mobile Sidebar Overlay */}
              {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
              )}

              {/* Sidebar - Hide on mobile when chat is selected */}
              <div
                className={`
                  fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                  w-80 sm:w-96 lg:w-80 xl:w-96
                  transform transition-transform duration-300 ease-in-out
                  lg:transform-none lg:transition-none
                  ${isSidebarOpen && !selectedChat ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                  ${selectedChat ? "lg:translate-x-0" : ""}
                  flex-shrink-0 p-4 lg:p-4
                `}
              >
                <MyChats onClose={() => setIsSidebarOpen(false)} />
              </div>

              {/* Main Chat Area - Full width on mobile when chat selected */}
              <div
                className={`
                flex-1 min-w-0 p-0 sm:p-4 lg:pl-0
                ${selectedChat ? "w-full lg:w-auto" : ""}
              `}
              >
                <Chatbox
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chatpage
