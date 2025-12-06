'use client'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left">
        {/* Dino Image */}
        <Image
          src="/assets/dino.png"
          alt="dino"
          width={70}
          height={70}
          className="mx-auto md:mr-4 mb-3 md:mb-0"
        />
        {/* Text Content */}
        <div>
          <h1 className="text-5xl font-bold">404</h1>
          <p className="text-lg mt-2">Page Not Found</p>
        </div>
      </div>
          <p className="text-gray-500 text-sm mt-2">
            "Roar! 🦖 Oops, I took a wrong turn and lost the page... 🍪"
          </p>
      {/* Button */}
      <div className="mt-6 flex gap-3">
      <Button variant="outline" onClick={handleGoBack}>
      Back to last page
    </Button>
        <Button>
          <Link href="/">Go back to home</Link>
        </Button>
      </div>
    </div>
  );
}
