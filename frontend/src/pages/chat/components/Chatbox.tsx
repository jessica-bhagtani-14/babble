import SingleChat from "./SingleChat"
import { MessageSquare, Menu } from "lucide-react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { useChatStore } from "../../../state/chatStore"

interface ChatboxProps {
  fetchAgain: boolean
  setFetchAgain: (value: boolean) => void
  onOpenSidebar?: () => void
}

const Chatbox = ({ fetchAgain, setFetchAgain, onOpenSidebar }: ChatboxProps) => {
  const { selectedChat } = useChatStore()

  return (
    <Card className="h-full overflow-hidden bg-card/40 backdrop-blur-xl py-0 rounded-none sm:rounded-lg">
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8 typography relative select-none">
          {/* Mobile menu button */}
          {onOpenSidebar && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSidebar}
              className="absolute top-4 left-4 lg:hidden bg-transparent"
            >
              <Menu className="w-4 h-4 mr-2" />
              Chats
            </Button>
          )}

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">Welcome to babble</h3>
          <p className="text-center max-w-md text-sm sm:text-base px-4">
            Select a chat from the sidebar to start messaging, or create a new conversation to get started.
          </p>
          <div
            className={`fixed inset-0 -z-10 transition-opacity duration-700 ease-in-out opacity-20 dark:opacity-30`}
            style={{
              backgroundImage: `url('/bg-frames/Frame4.svg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </Card>
  )
}

export default Chatbox
