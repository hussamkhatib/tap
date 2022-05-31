import NavTabs from "../../components/NavTabs";
import { profileTabs } from "../../components/NavTabs/tabs";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useReducer,
  useState,
} from "react";
import Input from "../../components/ui/Input";
import ListBox from "../../components/ui/ListBox";

import reducer, { initialValue } from "../../store/student.reducer";
import { branches } from "../../store/student.data";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { validationMsg } from "../../store/student.data";
import { useSession } from "next-auth/react";

const Edit = () => {
  const { data: session }: { data: any } = useSession();
  const { usn } = session.user;
  const [selectedBranch, setSelectedBranch] = useState();
  const [state, dispatch] = useReducer(reducer, initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/student/${usn}`)
      .then((res) => res.json())
      .then((data) => {
        const { name, usn, branch, validated, resume } = data;
        dispatch({
          type: "init",
          payload: { name, usn, validated, resume },
        });
        setSelectedBranch(branch);
        setIsLoaded(true);
      });
  }, []);

  const inputAction = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "textInput",
      payload: { key: event.target.name, value: event.target.value },
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { name, usn, resume } = state;
    try {
      const body = {
        name,
        usn,
        resume,
        validated: "pending",
        branch: selectedBranch,
      };
      await fetch(`/api/student/${usn}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      dispatch({ type: "sendForValidation" });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoaded) return <div>Loading ... </div>;

  const { status, description } = validationMsg[state.validated];
  return (
    <div>
      <NavTabs tabs={profileTabs} />
      <Alert status={status}>{description}</Alert>
      <form onSubmit={handleSubmit} className="pt-4">
        <div className="flex flex-col">
          <label htmlFor="name">
            <span className="label-text">Name</span>
          </label>
          <Input
            value={state.name}
            name="name"
            type="text"
            id="name"
            onChange={inputAction}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="usn">
            <span className="label-text">USN</span>
          </label>
          <Input
            value={state.usn}
            name="usn"
            type="text"
            id="usn"
            onChange={inputAction}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="resume">
            <span className="label-text">Link to resume</span>
          </label>
          <Input
            value={state.resume}
            name="resume"
            type="text"
            id="resume"
            onChange={inputAction}
            required
          />
        </div>
        <ListBox
          Label="Branch"
          selected={selectedBranch}
          setSelected={setSelectedBranch}
          list={branches}
        />
        <ButtonGroup className="pt-4" align="end">
          {/* <Button>Cancel</Button> */}
          <Button type="submit">Send for validation</Button>
        </ButtonGroup>
      </form>
    </div>
  );
};

export default Edit;
