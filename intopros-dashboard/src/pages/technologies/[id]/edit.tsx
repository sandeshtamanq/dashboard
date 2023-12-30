import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import TechnologyForm from "../../../components/Technologies/TechnologyForm";

export default function EditTechnology() {
  const router = useRouter();
  const { id } = router.query;

  const [technologyDetails, setTechnologyDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/technologies/${id}`).then((res) => {
        if (res) setTechnologyDetails(res.data?.data);
        else router.push("/technologies");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <TechnologyForm
        mode="edit"
        defaultValues={{
          title: technologyDetails?.title,
          shortDescription: technologyDetails?.shortDescription,
          fullDescription: technologyDetails?.fullDescription,
          image: technologyDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${technologyDetails?.image}`
            : undefined,
        }}
      />
    </>
  );
}
