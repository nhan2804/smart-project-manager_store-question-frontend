import React, { useState } from "react";
import { Input, Select, Space, Cascader, AutoComplete, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import axios from "axios";
const { Option } = Select;

const Browser = () => {
  const [option, setoption] = useState("GET");
  const [url, seturl] = useState("");
  const [data, setData] = useState("");
  console.log(option);
  console.log(url);
  const handleSend = () => {
    axios({
      method: option,
      url: url,
      withCredentials: false,
    })
      .then((d) => {
        if (d?.data.includes("html")) {
          setData(d.data);
        } else {
          setData(JSON.stringify(d.data));
        }
      })
      .catch((e) => {
        console.log(e?.response?.data);
        setData("Error Method not supported" + e?.response?.data);
        if (e?.response?.status === 400 || e?.response?.status === 401) {
          setData(e?.response?.data?.message || "error");
          //   setData();
        }
      });
  };
  return (
    <div>
      <Input.Group compact>
        <Select
          onChange={setoption}
          defaultValue="GET"
          style={{ width: "25%" }}
        >
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
          <Option value="HEAD">HEAD</Option>
        </Select>
        <Input
          value={url}
          onChange={(e) => seturl(e.target.value)}
          style={{ width: "65%" }}
          placeholder="Url"
        ></Input>
        <Button onClick={handleSend} color="primary" style={{ width: "10%" }}>
          Send
        </Button>
      </Input.Group>
      <h1>Kết quả</h1>
      <div dangerouslySetInnerHTML={{ __html: data }}></div>
    </div>
  );
};

export default Browser;
