import { X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"

interface UserBadgeItemProps {
  user: {
    _id: string
    name: string
    pic?: string
  }
  handleFunction: () => void
  admin?: string
}

const UserBadgeItem = ({ user, handleFunction, admin }: UserBadgeItemProps) => {
  const isAdmin = admin === user._id

  return (
    <Badge
      variant="secondary"
      className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors ${
        isAdmin ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-gray-100 text-gray-800"
      }`}
      onClick={handleFunction}
    >
      <Avatar className="w-5 h-5">
        <AvatarImage src={user.pic || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
          {user.name[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium truncate max-w-24">{user.name}</span>
      {isAdmin && <span className="text-xs bg-blue-200 text-blue-800 px-1 rounded">Admin</span>}
      <X className="w-3 h-3 hover:text-red-600" />
    </Badge>
  )
}

export default UserBadgeItem
