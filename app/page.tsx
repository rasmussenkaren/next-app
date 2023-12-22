'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};

function agregarParametro(url: string, parametro: string): string {
  if (parametro) {
    return `${url}?userId=${parametro}`;
  } else {
    return url;
  }
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Page() {
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);

  const { data: posts, error } = useSWR(
    () =>
    agregarParametro('https://jsonplaceholder.typicode.com/posts', debouncedSearch),
    fetcher,
  );

  if (error) return <div>Error al cargar los datos</div>;

  return (
    <main className="min-h-screen">
      <section>
        <header className="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Posts</h2>
          </div>
          <div className="group relative">
            <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-5 ring-1 ring-slate-200 shadow-sm"
              type="text"
              aria-label="Filter projects"
              placeholder="Filter posts..."
              onChange={handleInputChange}
            />
          </div>
        </header>

        <ul className="bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6">
          {posts && posts.map((post) => (
          <li key={post.id} className="flex">
            <div className="hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md group rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm">
              <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                <div>
                  <dt className="sr-only">Title</dt>
                  <dd className="group-hover:text-white font-semibold text-slate-900">
                    {post.title}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Body</dt>
                  <dd className="group-hover:text-blue-200 text-slate-500">{post.body}</dd>
                </div>
                <div>
                  <dt className="sr-only">UserId</dt>
                  <dd className="group-hover:text-blue-200 text-slate-900">User id: {post.userId}</dd>
                </div>
              </dl>
            </div>
          </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
