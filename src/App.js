import "regenerator-runtime/runtime";
import React, { useState, useEffect, useRef } from "react";
import { login, logout } from "./utils";
import { SkynetClient } from "skynet-js";

// style sheets
import "./global.css";
import "bootstrap/dist/css/bootstrap.min.css";

//import components from react bootstrap

import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Nav,
  Navbar,
  NavDropdown,
  Alert,
} from "react-bootstrap";

// Since v1.5.1 you're now able to call the init function for the web version without options. The current URL path will be used by default. This is recommended when running from a gateway.

import ReactMarkdown from "react-markdown";
import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

// Entering into the skynet

// Open a Portal to Skynet
const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;

// Initiate A skynet client
const client = new SkynetClient(portal);
console.log(client);

export default function App() {
  // state variables
  const [bufferVal, changeBuffer] = useState([]);
  const [arweaveKey, changeArweaveKey] = useState("");
  const [getImage, changeGetImage] = useState("");
  const [skyLinkURLVal, changeSkyLinkURLVal] = useState("");

  //references
  const idRef = useRef();

  const processPic = async (event) => {
    // prevent default action of the button
    event.preventDefault();

    // process file for ipfs

    // retrieve file blob
    const file = event.target.files[0];

    changeBuffer(new File([file], "test file"));

    // create new instance of a file reader
    // const reader = new FileReader();

    // read array as buffer
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   // once buffer has loaded set array in state variable for later use
    //   changeBuffer(reader.result);
    //   console.log(reader.result);
    // };
  };

  const saveToSkynet = async () => {
    // file data from process pic function
    let data = bufferVal;

    // upload user file and get a skyfile descriptor
    const { skylink } = await client.uploadFile(data);

    // get skylink URL
    const skylinkUrl = await client.getSkylinkUrl(skylink);

    // set SkyLink URL to state variable
    changeSkyLinkURLVal(skylinkUrl);

    console.log(skylinkUrl);
  };

  const getData = async () => {
    // To use this later in our React app, save the URL to the state.
    // setFileSkylink(skylinkUrl);
  };

  return (
    <React.Fragment>
      <Navbar bg='light' expand='lg'>
        <Container>
          <Navbar.Brand href='#home'>NEAR-Arweave</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link href='https://hackmd.io/hKa_4ZoaQeGfjHv6TYDeNw'>
                Tutorial
              </Nav.Link>
              <Nav.Link href='#link'>Link</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row
          className='d-flex justify-content-center'
          style={{ marginTop: "3vh" }}
        >
          <Card style={{ width: "50vw", padding: "3vw" }}>
            <Card.Title>Step 1!</Card.Title>
            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label>Choose a .png file from your computer</Form.Label>
              <Form.Control onChange={processPic} type='file' />
            </Form.Group>
            <Button onClick={saveToSkynet}>Submit</Button>
            <br></br>
            <Card.Header>Skynet URL</Card.Header>
            <Alert>{skyLinkURLVal}</Alert>
          </Card>
        </Row>

        <Row className='d-flex justify-content-center'>
          <Card style={{ width: "50vw", padding: "3vw", marginTop: "3vh" }}>
            <Card.Title>Step 2! Mint NFT</Card.Title>
            <Card.Body>
              <Card.Header>Enter the Following in Your Terminal</Card.Header>
              <Alert>ID=your-testnet-account-name.testnet</Alert>
              <Alert>TITLE={`<name you want to give your NFT>`}</Alert>
              <Alert>
                SKYNETURL={`<The TransactionID given to you above>`}
              </Alert>
              <Alert>
                {`near call example-nft.testnet nft_mint '{"token_id": "'$SKYNETURL'", "receiver_id": "'$ID'", "token_metadata": { "title": "'$TITLE'", "description": "My NFT media", "copies": 1}}' --accountId $ID --deposit 0.1`}
              </Alert>{" "}
            </Card.Body>
          </Card>
        </Row>

        <Row className='d-flex justify-content-center'>
          <Card style={{ width: "50vw", padding: "3vw", marginTop: "3vh" }}>
            <Card.Title>Step 3! Get List of Minted Tokens</Card.Title>
            <Card.Body>
              <Card.Header>Enter the Following in Your Terminal</Card.Header>
              <Alert>{`near view example-nft.testnet nft_tokens_for_owner '{"account_id": "'$ID'"}'`}</Alert>
            </Card.Body>
          </Card>
        </Row>

        <Row
          className='d-flex justify-content-center'
          style={{ marginTop: "10vh" }}
        ></Row>
      </Container>
    </React.Fragment>
  );
}
