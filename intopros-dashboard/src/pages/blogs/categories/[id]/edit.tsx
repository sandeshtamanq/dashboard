import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { makeRequest } from "../../../../utils/api";
import CategoryForm from "../../../../components/Blog/CategoryForm";


export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [blogCategory, setBlogCategory] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/blogs/category/${id}`).then((res) => {
        if (res) setBlogCategory(res.data?.data);
        else router.push("/blogs/categories");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <CategoryForm
        mode="edit"
        defaultValues={{
          category: blogCategory?.category,
        }}
      />
    </>
  );
}
