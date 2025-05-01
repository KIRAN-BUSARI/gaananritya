import { useEffect } from 'react';
import Blogs from './Blogs';

function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen px-4 md:px-20">
      <div>
        <Blogs />
      </div>
    </div>
  );
}

export default BlogPage;
