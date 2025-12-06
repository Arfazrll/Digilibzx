import { Notification } from "@/types/interfaces"

export const notifs: Notification[] = [
	{
		id: "1",
		userId: "1",
		title: "New Book Available",
		message: "The book 'The Midnight Library' by Matt Haig is now available in our library.",
		type: "INFO",
		date: "Nov 15, 2023 at 9:30 AM",
		read: false,
	},
	{
		id: "2",
		userId: "1",
		title: "Due Date Reminder",
		message: "The book 'To Kill a Mockingbird' is due tomorrow. Please return or renew it.",
		type: "REMINDER",
		date: "Nov 14, 2023 at 2:00 PM",
		read: true,
	},
	{
		id: "3",
		userId: "2",
		title: "Late Return Alert",
		message: "Your book 'The Great Gatsby' is overdue. Please return it as soon as possible.",
		type: "ALERT",
		date: "Nov 13, 2023 at 11:45 AM",
		read: false,
	},
	{
		id: "4",
		userId: "2",
		title: "Book Recommendation",
		message: "Based on your reading history, we think you might enjoy 'The Catcher in the Rye' by J.D. Salinger.",
		type: "INFO",
		date: "Nov 12, 2023 at 10:15 AM",
		read: false,
	},
	{
		id: "5",
		userId: "3",
		title: "Library Event",
		message: "Join us for a book discussion on 'Pride and Prejudice' this Saturday at 3 PM.",
		type: "INFO",
		date: "Nov 11, 2023 at 4:00 PM",
		read: true,
	},
]