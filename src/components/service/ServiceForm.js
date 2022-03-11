import styles from "../project/ProjectForm.module.css";
import Input from "../form/Input";
import SubmittButton from "../form/SubmitButton";
import { useState } from "react";

function ServiceForm({ handleSubmit, textBtn, projectData }) {
  const [service, setService] = useState({});

  function handleChange(e) {
    setService({ ...service, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    projectData.services.push(service);
    handleSubmit(projectData);
  }
  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do serviço"
        name="name"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
      />
      <Input
        type="number"
        text="Custo do serviço"
        name="cost"
        placeholder="Insira o custo do serviço"
        handleOnChange={handleChange}
      />
      <Input
        type="text"
        text="Descrição do serviço"
        name="description"
        placeholder="descreva o serviço"
        handleOnChange={handleChange}
      />
      <SubmittButton text={textBtn} />
    </form>
  );
}

export default ServiceForm;
