import React, { useState } from "react";
import { Form, Input, Button, Affix, Alert, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./style.css";
import { PlusCircleOutlined, QuestionOutlined } from "@ant-design/icons";

const DynamicFieldSet = () => {
  const [answer, setanswer] = useState([
    {
      question: "Đây là 1 câu hỏi example mà ta đã cho nó default value",
      answers: [
        `The problem is that all `,
        `
        generated inputs are in one `,
        ` line and I would like them to`,
        ` be underneath each other (for visual ex`,
        ` planation see snippets below). I can't just `,
        `add a <br /> at the end because that wouldn't be valid JSX`,
      ],
    },
  ]);
  const [isShow, setIsShow] = useState(false);
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    setanswer([...answer, values]);
    setIsShow(false);
  };

  return (
    <div
      style={{ width: 800, maxWidth: "100%", padding: 10, margin: "0 auto" }}
    >
      <Affix offsetTop={10}>
        <Button onClick={() => setIsShow(!isShow)}>
          <PlusCircleOutlined />
          <QuestionOutlined />
        </Button>
      </Affix>
      <h1>Danh sách câu hỏi</h1>
      {answer?.map((e, i) => (
        <>
          <Alert message={`${i + 1} : ${e?.question}`} type="info" />
          <Checkbox.Group
            options={e?.answers?.map((a) => {
              return { value: a, label: a };
            })}
          />
        </>
      ))}

      {isShow && (
        <Form layout="horizontal" name="dynamic_form_item" onFinish={onFinish}>
          <h1>Câu hỏi</h1>
          <Form.Item
            name="question"
            rules={[
              {
                required: true,
                message: "Vui lòng điền câu hỏi",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.List
            name="answers"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(
                      new Error("Ít nhất phải có 1 đáp án")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                <h1>Câu trả lời</h1>
                {fields.map((field, index) => (
                  <Form.Item
                    // label={index === 0 ? "Câu trả lời" : ""}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please input passenger's name or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="passenger name"
                        // style={{ width: "60%" }}
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "60%" }}
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>

                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
export default DynamicFieldSet;
