import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { Modal } from "../Modal";
import { ModalProps } from "../Modal.types";
import { Button } from "../Button";

const Demo = (args: ModalProps) => {
  const [active, setActive] = useState(false);
  return (
    <div>
      <Button onClick={() => setActive(true)} label="Open Modal" />
      <Modal
        active={active}
        hideModal={() => setActive(false)}
        title="Edit Presets"
        footer={
          <>
            <Button label="Delete All" />
            &nbsp;&nbsp;
            <Button onClick={() => setActive(false)} label="Cancel" />
          </>
        }
      >
        Preset Controls Here
      </Modal>
    </div>
  );
};

const meta: Meta = {
  title: "ui/Modal",
  component: Demo,
};

export default meta;

const Template: Story<ModalProps> = (args) => <Demo {...args} />;

export const Default = Template.bind({});

Default.args = {};
