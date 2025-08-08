import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../../config/ChatLogics"
import { useUserStore } from "../../../state/userStore"
import { useAutoScroll } from "../../../hooks/useAutoScroll"

interface Message {
  _id: string
  sender: {
    _id: string
    name: string
    pic: string
  }
  content: string
  createdAt?: string
  seenBy?: string[]
}

interface ScrollableChatProps {
  messages: Message[]
}

const ScrollableChat = ({ messages }: ScrollableChatProps) => {
  const user = useUserStore((s) => s.user)
  const chatRef = useAutoScroll<HTMLDivElement>([messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div ref={chatRef} className="h-full overflow-y-auto px-1 pb-4 pr-1 flex flex-col gap-1 sm:gap-2 touch-pan-y">
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} className="flex items-end space-x-2">
            {/* Avatar */}
            {(isSameSender(messages, m, i, user?._id || "") || isLastMessage(messages, i, user?._id || "")) && (
              <div className="flex-shrink-0 mb-1">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={m.sender.pic || "/placeholder.svg"} alt={m.sender.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {m.sender.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Message Bubble */}  
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl border break-words ${
                m.sender._id === user?._id
                  ? "bg-background border-muted-foreground/30 backdrop-blur-3xl text-primary border ml-auto rounded-tr-none"
                  : "bg-muted rounded-tl-none"
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user?._id || ""),
                marginTop: isSameUser(messages, m, i) ? 2 : 8,
                alignSelf: m.sender._id === user?._id ? "flex-end" : "flex-start",
              }}
            >
              {/* Sender name for group chats */}
              {m.sender._id !== user?._id && !isSameUser(messages, m, i) && (
                <div className="text-xs font-medium text-muted-foreground mb-1">{m.sender.name}</div>
              )}

              {/* Message content */}
              <div className="text-sm leading-relaxed">{m.content}</div>

              {/* Timestamp and Read Receipts */}
              <div className="flex items-center gap-2 mt-1">
                {m.createdAt && (
                  <span className={`text-xs ${m.sender._id === user?._id ? "text-primary" : "text-muted-foreground"}`}>{formatTime(m.createdAt)}</span>
                )}
                {/* Read Receipt: show checkmark if all recipients have seen */}
                {m.sender._id === user?._id && m.seenBy && (
                  <span title="Seen by everyone" className="ml-1 text-green-500 text-xs">✔✔</span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ScrollableChat
