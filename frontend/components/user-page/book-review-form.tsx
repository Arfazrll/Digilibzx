'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';

interface BookReviewFormProps {
  bookId: string;
  onSubmit: (review: { authorId: string; rating: number; content: string }) => void;
}

export function BookReviewForm({ bookId, onSubmit }: BookReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [authorId, setAuthor] = useState('');

  // Ambil authorId dari localStorage saat komponen dimuat
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setAuthor(userId);
    } else {
      console.warn('No userId found in localStorage');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorId) {
      console.error('Author ID is missing!');
      return;
    }

    onSubmit({ authorId, rating, content });
    setRating(0);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {/* <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label> */}
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`w-6 h-6 cursor-pointer ${
                value <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(value)}
            />
          ))}
        </div>
      </div>
      <div>
        {/* <label htmlFor="content" className="block text-sm font-medium text-gray-700">Your Review</label> */}
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1"
          rows={4}
          placeholder="Write your review here..."
        />
      </div>
      <Button type="submit" disabled={rating === 0 || content.trim() === ''}>
        Submit Review
      </Button>
    </form>
  );
}
