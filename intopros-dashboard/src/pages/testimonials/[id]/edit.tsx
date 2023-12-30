import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TestimonialForm from "../../../components/Testimonial/TestimonialForm";

import { makeRequest } from "../../../utils/api";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [testimonialDetails, setTestimonialDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/testimonials/${id}`).then((res) => {
        if (res) {
          setTestimonialDetails(res.data?.data);
        }
      });
    }
  }, [id]);

  return (
    <>
      <TestimonialForm mode="edit" defaultValues={testimonialDetails} />
    </>
  );
}
