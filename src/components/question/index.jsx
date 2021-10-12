import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Affix, Alert, Checkbox, Radio } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { PlusCircleOutlined, QuestionOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "../../hooks/useQuery";
import socket from "../../services/socket";
import "./style.css";
import { Select } from "antd";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo } from "../../app/slices/authSlice";
import { getProfile, getUsersInfo } from "../../services/user";
import { useSelector } from "react-redux";

const DynamicFieldSet = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const [answer, setanswer] = useState([
    {
      id: 1,
      question: "Đây là 1 câu hỏi example mà ta đã cho nó default value",
      type: "text",
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
  const roomId = query.get("room");
  const [participants, setParticipants] = useState([]);
  const [participantsList, setParticipantsList] = useState({});
  const [isShow, setIsShow] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [questionType, setQuestionType] = useState("text");
  const onFinish = (values) => {
    values.answers = values.answers ?? [];
    values.id = uuidv4();
    socket.emit("newQuestion", { ...values, roomId, type: questionType });
    const newAnswer = answer;
    newAnswer.push({ ...values, type: questionType });
    setanswer((answer) => newAnswer);
    setIsShow(false);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e);
  };

  const handleAnwserFormSubmit = (e) => {
    e.preventDefault();
    socket.emit("newAnswer", { value: e.target.anwser.value, roomId });
    const questionList = [...answer];
    questionList[questionList.length - 1].answers.push(e.target.anwser.value);
    setanswer((answer) => questionList);
    e.target.reset();
  };

  useEffect(() => {
    async function getParticipantProfile() {
      const { data } = await getUsersInfo({ ids: participants });
      setParticipantsList(data);
    }

    if (participants.length > 0) {
      getParticipantProfile();
    }
  }, [participants]);

  // const questionRef = useRef(null);
  // questionRef.current = answer?.answers;
  // định dùng Ref mà có cách kia rồi
  useEffect(() => {
    const host = query.get("isHost");
    setIsHost(host === "true");

    // lấy info user
    const token = query.get("token");
    dispatch(setToken(token));

    async function getUserInfo() {
      const { data } = await getProfile();
      dispatch(setUserInfo(data));
      socket.emit("join", { roomId, user: data.id, isHost: host === "true" });
    }
    getUserInfo();

    socket.on("newQuestion", (data) => {
      let latestAnswer;
      setanswer((answer) => {
        latestAnswer = answer;
        return answer;
      });
      // biến latestAnswer là mới nhất rồi đó ông, xử lý đi nha
      setanswer((answer) => [...answer, data]);
    });

    socket.on("newAnswer", (data) => {
      console.log(answer);
      // setanswer(answer => [
      //   ...answer.slice(0, -2),
      //   ...answer.slice(-1).answers.push(data.value)
      // ]);
    });

    socket.on("participantsInRoom", (data) => {
      console.log("data", data);
      setParticipants((participants) => data);
    });
  }, []);

  return (
    <div className="flex justify-between mx-10">
      <div>
        {isHost && (
          <>
            <div className="font-bold">Danh sách câu hỏi của room</div>
            <div className="text-left">
              {answer.map((e, i) => (
                <div key={i}>
                  {i + 1}. {e.question}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div
        style={{ width: 800, maxWidth: "100%", padding: 10, margin: "0 auto" }}
      >
        {isHost && (
          <Affix offsetTop={10}>
            <Button onClick={() => setIsShow(!isShow)}>
              <PlusCircleOutlined />
              <QuestionOutlined />
            </Button>
          </Affix>
        )}
        <h1>Câu hỏi</h1>
        <>
          <Alert
            message={`${answer.length} : ${
              answer[answer.length - 1]?.question
            }`}
            type="info"
          />
          {answer[answer.length - 1].type === "text" && (
            <div>
              {answer[answer.length - 1]?.answers?.map((a) => (
                <div className="text-left">{a}</div>
              ))}
            </div>
          )}
          {answer[answer.length - 1].type === "checkbox" && (
            <Checkbox.Group
              options={answer[answer.length - 1]?.answers?.map((a) => {
                return { value: a, label: a };
              })}
            />
          )}
          {answer[answer.length - 1].type === "radio" && (
            <Radio.Group
              options={answer[answer.length - 1]?.answers?.map((a) => {
                return { value: a, label: a };
              })}
            />
          )}
        </>

        {isShow && isHost && (
          <Form
            layout="horizontal"
            name="dynamic_form_item"
            onFinish={onFinish}
          >
            <h1>Câu hỏi</h1>
            <Select
              defaultValue={`Loại câu trả lời`}
              className="!w-20"
              onChange={handleQuestionTypeChange}
            >
              <Option value="text">Trả lời</Option>
              <Option value="radio">Một Lựa chọn</Option>
              <Option value="checkbox">Nhiều lựa chọn</Option>
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
                    if (questionType !== "text") {
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
        <form onSubmit={handleAnwserFormSubmit}>
          <input
            name="anwser"
            style={{ width: "50%" }}
            placeholder="Thêm câu trả lời"
          />
        </form>
      </div>
      <div>
        <div>Danh sách người tham gia</div>
        <ul>
          {participants.map((id) => (
            <li key={id}>
              <button className="rounded-md mt-2 px-2 py-2 cursor-pointer flex items-center">
                <img
                  src={participantsList[id]?.avatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full"
                />
                <span className="ml-2">{participantsList[id]?.fullname}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default DynamicFieldSet;
