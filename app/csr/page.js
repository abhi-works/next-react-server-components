'use client';

import { Suspense, useEffect, useState } from 'react';

// Client Components
import Page from '../../components/page';
import Story from '../../components/story';

// Utils
import fetchData from '../../lib/fetch-data';
import { transform } from '../../lib/get-item';
import useData from '../../lib/use-data';
import Skeletons from '../../components/skeletons';

function StoryWithData({ id }) {
  if (typeof window === 'undefined') return <Skeletons />;
  const { data } = useData(`s-${id}`, () =>
    fetchData(`item/${id}`).then(transform)
  );
  return <Story {...data} />;
}

function NewsWithData() {
  const { data: storyIds } = useData('top', () => fetchData('topstories'));
  return (
    <>
      {storyIds.slice(0, 30).map((id) => {
        return (
          <Suspense key={id} fallback={<Skeletons />}>
            <StoryWithData id={id} />
          </Suspense>
        );
      })}
    </>
  );
}

export default function CSRPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Page>
      {mounted ? (
        <Suspense fallback={<Skeletons />}>
          <NewsWithData />
        </Suspense>
      ) : (
        <Skeletons />
      )}
    </Page>
  );
}
