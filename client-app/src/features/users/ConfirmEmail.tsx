import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/util/hooks";
import { useStore } from "../../app/stores/store";
import LoginForm from "./LoginForm";

export default function ConfirmEmail() {
  const { modalStore } = useStore();
  const email = useQuery().get("email") as string;
  const token = useQuery().get("token") as string;

  const Status = {
    Verifying: "Verifying",
    Failed: "Failed",
    Success: "Success",
  };

  const [status, setStatus] = useState<string>(Status.Verifying);

  const handleConfirmEmailResend = () => {
    agent.Account.resendEmailConfirmationLink(email)
      .then(() => toast.success("Email has been successfully sent"))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    agent.Account.verifyEmail(token, email)
      .then(() => setStatus(Status.Success))
      .catch((error) => {
        setStatus(Status.Failed);
        console.log(error);
      });
  }, [Status.Success, Status.Failed, email, token]);

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>;
      case Status.Failed:
        return (
          <div>
            <p>
              Verification Failed. You can try resending the verification link
              to your email
            </p>
            <Button
              primary
              onClick={handleConfirmEmailResend}
              size="huge"
              content="Resend Email"
            />
          </div>
        );
      case Status.Success:
        return (
          <div>
            <p>Email has been verified, you can now login</p>
            <Button
              primary
              onClick={() => modalStore.openModal(<LoginForm />)}
              size="huge"
              content="Open Login"
            />
          </div>
        );
    }
  };

  return (
    <Segment>
      <Header icon>
        <Icon name="envelope" />
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
}
