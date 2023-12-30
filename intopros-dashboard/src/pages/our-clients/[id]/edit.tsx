import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeRequest } from "../../../utils/api";
import ClientForm from "../../../components/Our Client/ClientForm";

export default function EditClient() {
  const router = useRouter();
  const { id } = router.query;

  const [clientDetails, setClientDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/our-client/${id}`).then((res) => {
        if (res) setClientDetails(res.data?.data);
        else router.push("/our-clients");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <ClientForm
        mode="edit"
        defaultValues={{
          name: clientDetails?.name,
          designation: clientDetails?.designation,
          linkedin: clientDetails?.linkedin,
          image: clientDetails?.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${clientDetails?.image}`
            : undefined,
        }}
      />
    </>
  );
}
