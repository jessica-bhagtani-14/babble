import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"

interface UserListItemProps {
  user: {
    _id: string
    name: string
    email: string
    pic?: string
  }
  handleFunction: () => void
}

const UserListItem = ({ user, handleFunction }: UserListItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={handleFunction}
      className="w-full justify-start p-3 h-auto border rounded-lg"
    >
      <div className="flex items-center space-x-3 w-full typography">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.pic || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <p className="font-medium">{user.name}</p>
          <p className="!text-xs xl:!text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
    </Button>
  )
}

export default UserListItem
