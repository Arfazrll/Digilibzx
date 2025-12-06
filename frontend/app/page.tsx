import React from 'react';

import { Star } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button"
import { assets } from './config';
import Navbar from '@/components/navbar-user';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <Hero />
        <BookSwiperCard />
        <Features />
        <Aboutus />

      </div>
      <Footer />
    </>
  );
}

const Hero = () => {
  return (

    <section
      className="h-screen flex items-center justify-center w-full"
      style={{
        backgroundImage: `url(${assets.bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl">
            Selamat Datang
          </h1>
          <p className="text-balance text-muted-foreground lg:text-lg">
            Bookwise: Jelajahi Dunia dengan Setiap Halaman
          </p>
        </div>
        <Button size="lg" className="mt-10">
          <Link href="/register">
            Masuk Untuk Lihat Semua Koleksi Buku
          </Link>
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            <Avatar className="size-14 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-2.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-4.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-5.webp"
                alt="placeholder"
              />
            </Avatar>
          </span>
          <div>
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">5.0</span>
            </div>
            <p className="text-left font-medium text-muted-foreground">
              from 200+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

import {
  BookOpen,
  Bookmark,
  Library,
  Clock,
  UserCheck,
  Headphones,
} from 'lucide-react';

const features = [
  {
    title: 'Vast Collection',
    description:
      'Access thousands of books across various genres and categories, from fiction to educational resources.',
    icon: <Library className="size-4 md:size-6 text-white" />,
  },
  {
    title: 'Personalized Recommendations',
    description:
      'Receive book suggestions tailored to your reading history and preferences.',
    icon: <Bookmark className="size-4 md:size-6 text-white" />,
  },
  {
    title: 'Flexible Lending Periods',
    description:
      'Enjoy flexible borrowing durations that fit your schedule, with easy extensions available.',
    icon: <Clock className="size-4 md:size-6 text-white" />,
  },
  {
    title: 'Community Reviews',
    description:
      'Read and contribute to community reviews to discover what other readers love about a book.',
    icon: <UserCheck className="size-4 md:size-6 text-white" />,
  },
  {
    title: 'Audio Book Access',
    description:
      'Immerse yourself in stories with our growing collection of audiobooks available for all members.',
    icon: <Headphones className="size-4 md:size-6 text-white" />,
  },
  {
    title: 'Mobile-Friendly Platform',
    description:
      'Seamlessly browse, borrow, and read books on any device, wherever you are.',
    icon: <BookOpen className="size-4 md:size-6 text-white" />,
  },
];

const Features = () => {
  return (
    <section>
      <div className="container mx-auto max-w-screen-xl text-white">
        <h2 className="text-3xl font-semibold md:pl-5 lg:text-4xl text-black text-center">
          Permudah Aktivitas Membacamu Dengan Beragam Fitur BookWise
        </h2>
        <div className="mx-auto mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2 md:gap-y-6 lg:mt-20">
          {features.map((feature, idx) => (
            <div
              className="flex gap-6 rounded-lg p-5 bg-opacity-100 bg-gray-900 transition-transform transform hover:scale-105 hover:shadow-lg md:block"
              key={idx}
            >
              <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-600 p-4 md:size-12">
                {feature.icon}
              </span>
              <div>
                <h3 className="font-semibold md:mb-2 md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm opacity-90 md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


const books = [
  {
    title: 'Dilan 1990',
    author: 'Pidi Baiq',
    rating: 4.5,
    review: 'A classic tale of love and ambition set in the roaring twenties.',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442310576i/22037542.jpg',
  },

  {
    title: 'Dilan 1991',
    author: 'Pidi Baiq',
    rating: 4.5,
    review: 'A classic tale of love and ambition set in the roaring twenties.',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436161520i/25857857.jpg',
  },

  {
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    rating: 4.5,
    review: 'A classic tale of love and ambition set in the roaring twenties.',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1489732961i/1362193.jpg',
  },

  {
    title: 'Harry Potter & the Prisoner of Azkaban',
    author: 'J.K. Rowling',
    rating: 4.5,
    review: 'A classic tale of love and ambition set in the roaring twenties.',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630547330i/5.jpg',
  },

  {
    title: 'Dilan 1990',
    author: 'Pidi Baiq',
    rating: 4.5,
    review: 'A classic tale of love and ambition set in the roaring twenties.',
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442310576i/22037542.jpg',
  },
  // Add more books here if needed
]

function BookSwiperCard() {
  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-semibold md:pl-5 lg:text-4xl text-black text-center my-7">Our Books</h1>
      <Carousel className="container mx-auto max-w-screen-xl">
        <CarouselContent>
          {books.map((book, index) => (
            <CarouselItem key={index} className=' container md:basis-1/3'>
              <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96 w-full">
                    <Image
                      src={book.image}
                      alt={book.title}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md mx-auto"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">{book.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(book.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{book.rating}</span>
                    </div>
                    <p className="text-sm text-gray-700">{book.review}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}







import { AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

const people = [
  {
    id: "1301223164",
    name: "Gagas Surya Laksana",
    role: "Frontend",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
    image: "/teams/gagas.jpeg",
  },
  {
    id: "1301223240",
    name: "Maulana Cahya Magista",
    role: "Frontend",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
    image: "/teams/magista.jpeg",
  },
  {
    id: "1301223219",
    name: "M. Rafi Raihan Akbar",
    role: "Database",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-6.webp",
    image: "/teams/akbar.jpeg",
  },
  {
    id: "1301223102",
    name: "Zuhair Nashif A.",
    role: "Backend",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
    image: "/teams/nashif.jpeg",
  },
  {
    id: "1301223292",
    name: "Azrian Rifqi Radhitya",
    role: "Backend",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-6.webp",
    image: "/teams/azrian.jpeg",
  },
  {
    id: "1301223129",
    name: "Yustinus Dwi Adyra",
    role: "Backend",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
    image: "/teams/azrian.jpeg",
  },

];

const Aboutus = () => {
  return (
    <section
      id="aboutus"
      className="min-h-screen py-24"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          Meet our team
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          Kelompok 4 - IF-46-10
        </p>
      </div>
      <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>
            <p className="text-center font-medium">{person.name}</p>
            <p className="text-center text-muted-foreground">{person.role}</p>
            <p className="text-center text-muted-foreground">{person.id}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
