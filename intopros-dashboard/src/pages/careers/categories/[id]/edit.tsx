import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { makeRequest } from "../../../../utils/api";
import CareerCategoryForm from "../../../../components/Career/CareerCategoryForm";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [careerCategory, setCareerCategory] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/careers/category/${id}`).then((res) => {
        if (res) setCareerCategory(res.data?.data);
        else router.push("/careers/categories");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <CareerCategoryForm
        mode="edit"
        defaultValues={{
          category: careerCategory?.category,
        }}
      />
    </>
  );
}
