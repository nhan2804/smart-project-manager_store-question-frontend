import React, { useState, useEffect } from "react";
import { Form, Input, Button, Affix, Alert, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { PlusCircleOutlined, QuestionOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '../../hooks/useQuery'
import socket from "../../services/socket";
import "./style.css";
import { Select } from "antd";

const DynamicFieldSet = () => {
  const { Option } = Select;

  const [answer, setanswer] = useState([
    {
      id: 1,
      question: "Đây là 1 câu hỏi example mà ta đã cho nó default value",
      type: 'text',
      answers: [
        `The problem is that all `,
        `generated inputs are in one `,
        ` line and I would like them to`,
        ` be underneath each other (for visual ex`,
        ` planation see snippets below). I can't just `,
        `add a <br /> at the end because that wouldn't be valid JSX`,
      ],
    },
  ]);
  const query = useQuery();
  const roomId = query.get('room');
  const [isShow, setIsShow] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [questionType, setQuestionType] = useState('text');
  const onFinish = (values) => {
    values.answers = values.answers ?? [];
    console.log("Received values of form:", values);
    values.id = uuidv4();
    socket.emit('newQuestion', { ...values, roomId, type: questionType });
    // setanswer([...answer, values]);
    setIsShow(false);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e);
  }

  const handleAnwserFormSubmit = (e) => {
    e.preventDefault();
    socket.emit('newAnswer', { value: e.target.anwser.value, roomId })
    const questionList = [...answer];
    questionList[questionList.length - 1].answers.push(e.target.anwser.value);
    setanswer(questionList);
    e.target.reset();
  }

  useEffect(() => {
    const host = query.get('isHost');
    console.log(host === 'true');
    setIsHost(host === 'true');

    // lấy info user
    const token = query.get('token');

    // room_id
    socket.emit('join', { roomId })

    socket.on('newQuestion', data => {
      console.log('new qa', data);
      setanswer([...answer, data]);
    })

    socket.on('newAnswer', data => {
      console.log(answer);
      const questionList = [...answer]
      questionList[questionList.length - 1].answers.push(data.value);
      setanswer(answer => questionList);
    })

  }, []);

  return (
    <div
      style={{ width: 800, maxWidth: "100%", padding: 10, margin: "0 auto" }}
    >
      {isHost &&
        <Affix offsetTop={10}>
          <Button onClick={() => setIsShow(!isShow)}>
            <PlusCircleOutlined />
            <QuestionOutlined />
          </Button>
        </Affix>}
      <h1>Danh sách câu hỏi</h1>
      {answer?.map((e, i) => (
        <>
          <Alert message={`${i + 1} : ${e?.question}`} type="info" />
          { e.type === 'text' ?
            <div>
              {e?.answers?.map(a => (
                <div className="text-left" >{a}</div>
              ))}
            </div> : 
            (<Checkbox.Group
              options={e?.answers?.map((a) => {
                return { value: a, label: a };
              })}
            />)            
          }
        </>
      ))}

      {(isShow && isHost) && (
        <Form layout="horizontal" name="dynamic_form_item" onFinish={onFinish}>
          <h1>Câu hỏi</h1>
          <Select
            defaultValue={`Loại câu trả lời`}
            className="w-12"
            onChange={handleQuestionTypeChange}
          >
            <Option value="text" >Trả lời</Option>
            <Option value="radio" >Một Lựa chọn</Option>
            <Option value="checkbox" >Nhiều lựa chọn</Option>
          </Select>
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
                  if (questionType !== 'text') {
                    if (!names || names.length < 1) {
                      return Promise.reject(
                        new Error("Ít nhất phải có 1 đáp án")
                      );
                    }
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
      <form onSubmit={handleAnwserFormSubmit} >
        <input
          name="anwser"
          style={{ width: '50%'}}
          placeholder="Thêm câu trả lời"
        />
      </form>
    </div>
  );
};
export default DynamicFieldSet;
