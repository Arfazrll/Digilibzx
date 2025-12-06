import React from 'react';
import SidebarLayout from '@/components/user-page/sidebar-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import BookCollection from '@/components/user-page/book-collections';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { recomendations } from '@/app/config';
import toTitleCase from '@/common/to-title-case';

export default function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  const year = searchParams.year || '';

  const header = (
    <header className="container mx-auto flex h-10 shrink-0 items-center justify-between gap-2 px-4">
      {/* Breadcrumbs Section with Sidebar Trigger */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/collections`}>Collections</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/collections${category
                  ? `?category=${encodeURIComponent(category)}`
                  : search
                  ? `?search=${encodeURIComponent(search)}`
                  : ''
                }`}
              >
                {toTitleCase(category || search)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {search || category ? <BreadcrumbSeparator /> : ''}
            <BreadcrumbItem>
              <BreadcrumbPage>{category ? toTitleCase(search || '') : ''}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Recommendations Section */}
      <Breadcrumb>
        <BreadcrumbList className="hidden md:flex">
          {recomendations.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.name}</BreadcrumbLink>
              {index < recomendations.length - 1 && (
                <Separator orientation="vertical" className="mr-2 h-4" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );

  return (
    <SidebarLayout header={header}>
      <BookCollection search={search} category={category} years={year} />
    </SidebarLayout>
  );
}