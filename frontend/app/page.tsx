"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button"
import { assets } from './config';
import Navbar from '@/components/navbar-user';
import Footer from '@/components/footer';
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  BookOpen,
  Bookmark,
  Library,
  Clock,
  UserCheck,
  Headphones,
} from 'lucide-react';

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
  const [currentLang, setCurrentLang] = useState(0);
  const languages = [
    {
      title: "Selamat Datang",
      subtitle: "Digilibz: Jelajahi Dunia dengan Setiap Halaman",
      button: "Masuk Untuk Lihat Semua Koleksi Buku"
    },
    {
      title: "Welcome",
      subtitle: "Digilibz: Explore the World with Every Page",
      button: "Login to See All Book Collections"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-3xl font-extrabold lg:text-6xl transition-all duration-500 ease-in-out transform">
            <span className="inline-block animate-fade-in" key={currentLang}>
              {languages[currentLang].title}
            </span>
          </h1>
          <p className="text-balance text-muted-foreground lg:text-lg transition-all duration-500 ease-in-out">
            <span className="inline-block animate-fade-in" key={`sub-${currentLang}`}>
              {languages[currentLang].subtitle}
            </span>
          </p>
        </div>
        <Button size="lg" className="mt-10 hover:scale-105 transition-transform duration-300">
          <Link href="/register">
            {languages[currentLang].button}
          </Link>
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            <Avatar className="size-14 border md:mb-5 lg:size-16 hover:scale-110 transition-transform duration-300">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border md:mb-5 lg:size-16 hover:scale-110 transition-transform duration-300">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-2.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border md:mb-5 lg:size-16 hover:scale-110 transition-transform duration-300">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border md:mb-5 lg:size-16 hover:scale-110 transition-transform duration-300">
              <AvatarImage
                src="https://www.shadcnblocks.com/images/block/avatar-4.webp"
                alt="placeholder"
              />
            </Avatar>
            <Avatar className="size-14 border md:mb-5 lg:size-16 hover:scale-110 transition-transform duration-300">
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
              from 1000+ reviews
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
};

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
    <section className="py-20">
      <div className="container mx-auto max-w-screen-xl text-white">
        <h2 className="text-3xl font-semibold md:pl-5 lg:text-4xl text-black text-center mb-4">
          Simplify Your Reading Activities With Various Digilibz Features
        </h2>
        <div className="mx-auto mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2 md:gap-y-6 lg:mt-20">
          {features.map((feature, idx) => (
            <div
              className="group flex gap-6 rounded-lg p-5 bg-gray-900 transition-all duration-300 hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 md:block cursor-pointer relative overflow-hidden"
              key={idx}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-600 p-4 md:size-12 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </span>
              <div className="relative">
                <h3 className="font-semibold md:mb-2 md:text-xl group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm opacity-90 md:text-base group-hover:opacity-100 transition-opacity duration-300">
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
    title: 'Bumi',
    author: 'Tere Liye',
    rating: 4.7,
    review: 'An epic fantasy adventure filled with magic and mystery.',
    image: 'https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/img20220830_10560995.jpg',
  },
  {
    title: 'Negeri 5 Menara',
    author: 'Ahmad Fuadi',
    rating: 4.6,
    review: 'Inspiring story about education and determination.',
    image: 'https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/9789792248616_negeri-5-menara-_cu-cover-baru_.jpg',
  },
  {
    title: 'Perahu Kertas',
    author: 'Dee Lestari',
    rating: 4.4,
    review: 'Beautiful romance intertwined with art and dreams.',
    image: 'https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/products/hzc2r732ce.png',
  },
  {
    title: 'Sang Pemimpi',
    author: 'Andrea Hirata',
    rating: 4.5,
    review: 'A story of dreams and aspirations against all odds.',
    image: 'https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/Sang_Pemimpi.jpg',
  },
  {
    title: 'Pulang',
    author: 'Tere Liye',
    rating: 4.6,
    review: 'Emotional journey of finding home and belonging.',
    image: 'https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/pulang_tere_liye.jpeg',
  },
  {
    title: 'Hujan',
    author: 'Tere Liye',
    rating: 4.8,
    review: 'A captivating tale of parallel worlds and destiny.',
    image: 'https://image.gramedia.net/rs:fit:0:0/plain/https://cdn.gramedia.com/uploads/items/img20220905_11493451.jpg',
  },
];

function BookSwiperCard() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div 
      ref={scrollContainerRef}
      className="container mx-auto min-h-screen flex flex-col items-center justify-center w-full py-20"
    >
      <h1 className="text-3xl font-semibold md:pl-5 lg:text-4xl text-black text-center my-7">
        Our Book Recommendations
      </h1>
      <Carousel 
        className="container mx-auto max-w-screen-xl"
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
          duration: 30,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book, index) => (
            <CarouselItem 
              key={index} 
              className={`pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-0">
                  <div className="relative h-96 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      priority={index < 3}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {book.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(book.rating)
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
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}

const people = [
  {
    id: "103032300018",
    name: "Shania Rahmalia",
    role: "Frontend",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    image: "/teams/gagas.jpeg",
  },
  {
    id: "103032300077",
    name: "Rara Nur Annisa",
    role: "Frontend",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    image: "/teams/magista.jpeg",
  },
  {
    id: "103032300013",
    name: "Syahril Arfian Almazril",
    role: "Backend",
    avatar: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
    image: "/teams/akbar.jpeg",
  },
  {
    id: "103032330031",
    name: "Neng Intan Nuraeini",
    role: "Backend",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    image: "/teams/nashif.jpeg",
  },
  {
    id: "103032300087",
    name: "Galuh Ajeng",
    role: "Backend",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    image: "/teams/azrian.jpeg",
  },
];

const Aboutus = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="aboutus" className="py-24">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          Meet our Developer
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          Kelompok 3 - IT-47-04
        </p>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-8 hover:scale-105 transition-transform duration-300"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Team
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Team
            </>
          )}
        </Button>
      </div>

      {/* List anggota */}
      <div
        className={`container overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100 mt-16" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-10">
          {people.map((person, index) => (
            <div
              key={person.id}
              className={`flex flex-col items-center transition-all duration-500 hover:scale-105 ${
                isExpanded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24 hover:shadow-lg transition-shadow duration-300">
                <AvatarImage src={person.avatar} />
                <AvatarFallback>{person.name}</AvatarFallback>
              </Avatar>
              <p className="text-center font-medium">{person.name}</p>
              <p className="text-center text-muted-foreground">{person.role}</p>
              <p className="text-center text-muted-foreground">{person.id}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};