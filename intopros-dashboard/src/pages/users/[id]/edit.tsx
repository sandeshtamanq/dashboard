import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import UserForm from "../../../components/User/UserForm";
import { makeRequest } from "../../../utils/api";

export default function EditUser() {
  const router = useRouter();
  const { id, t } = router.query;

  const actionType = ["candidates", "system", "company"].includes(t as string)
    ? (t as any)
    : "candidates";

  const [userDetails, setUserDetails] = useState<any>({});
  const [rawUserDetails, setRawUserDetails] = useState<any>({});

  useEffect(() => {
    if (id) {
      makeRequest(`/users/list/${id}`).then((res) => {
        if (res?.data?.data) {
          const actualData = res.data?.data;
          const details = actualData?.details;

          setRawUserDetails(actualData);
          setUserDetails({
            // User
            id: actualData?.id,
            email: actualData?.email,
            username: actualData?.username,
            role: actualData?.role,
            // User details
            firstName: details?.firstName,
            middleName: details?.middleName,
            lastName: details?.lastName,
            mobile: actualData?.mobile,
            // User availabilities
            availabilities: details?.availabilities?.map(
              (av: any) => av?.type?.id
            ),
            isProfileVerified: details?.isProfileVerified,
            verificationRemark: details?.verificationRemark,
          });
        }
      });
    }
  }, [id]);

  return (
    <>
      <UserForm
        mode="edit"
        type={actionType}
        defaultValues={userDetails}
        rawData={rawUserDetails}
      />
    </>
  );
}
