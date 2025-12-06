import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BookReview(review: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.authorName}`} alt={review.authorName} />
            <AvatarFallback>{review.authorName}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.authorName}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{review.content}</p>
    </div>
  )
}

