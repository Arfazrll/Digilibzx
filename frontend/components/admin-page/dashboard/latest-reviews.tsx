import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function LatestReviews(data: any) {
  console.log(data)
  return (
    <div className="space-y-4">
        {data?.data?.map((item:any, index:number) => (
      <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.authorName}`} alt={item.authorName} />
                <AvatarFallback>{item.authorName}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.authorName}</p>
                <p className="text-sm text-muted-foreground">
                  Reviewed "{item.bookTitle}"
                </p>
              </div>
              <div className="flex items-center ml-auto font-medium">
              {[...Array(5)].map((_, i:number) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(item.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
            {item.content}
            </p>
          </CardContent>
      </Card>
        ))}
    </div>
  )
}

