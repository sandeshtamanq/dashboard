import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import BlogForm from "../../../components/Blog/BlogForm";
import { makeRequest } from "../../../utils/api";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [blogDetails, setBlogDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/blogs/${id}`).then((res) => {
        if (res) setBlogDetails(res.data?.data);
        else router.push("/blogs");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <BlogForm
        mode="edit"
        defaultValues={{
          title: blogDetails?.title,
          category: blogDetails?.category,
          description: blogDetails?.description,
          tags: blogDetails?._tags,
          image: blogDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${blogDetails?.image}`
            : undefined,
          publishedDate: blogDetails?.publishedDate,
          metaDescription: blogDetails?.metaDescription,
        }}
      />
    </>
  );
}
