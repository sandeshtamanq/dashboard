import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import ServiceForm from "../../../components/Services/ServiceForm";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  const [serviceDetails, setServiceDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/services/${id}`).then((res) => {
        if (res) setServiceDetails(res.data?.data);
        else router.push("/services");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <ServiceForm
        mode="edit"
        defaultValues={{
          title: serviceDetails?.title,
          tags: serviceDetails?.tags,
          shortDescription: serviceDetails?.shortDescription,
          description: serviceDetails?.description,
          image: serviceDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${serviceDetails?.image}`
            : undefined,
        }}
      />
    </>
  );
}
