import { useRouter } from "next/router";
import UserForm from "../../components/User/UserForm";

export default function AddUser() {
  const router = useRouter();

  const { t } = router.query;
  const actionType = ["candidates", "system", "company"].includes(t as string)
    ? (t as any)
    : "candidates";

  return (
    <>
      <UserForm mode="add" type={actionType} />
    </>
  );
}
