import { useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../axiosInstance";
import useInterval from "../useInterval";
import { IPosition } from "./../api/v1/futures/futuresController";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 50vw;
  min-height: 50vh;
  height: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Box = styled.div`
  width: 45%;
  min-height: 45vh;
  height: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  background-color: blue;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  font-size: 30px;
  background-color: tomato;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10vh;
  font-size: 30px;
`;

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  font-size: 30px;
  background-color: teal;
`;

const Data = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  font-size: 30px;
  background-color: teal;
`;

function Home() {
  const [position, setPosition] = useState<IPosition>({
    longEnteryPrice: "0",
    longMarkPrice: "0",
    longPositionAmt: "0",
    shortEnteryPrice: "0",
    shortMarkPrice: "0",
    shortPositionAmt: "0",
  });

  async function getPosition() {
    axiosInstance
      .get<IPosition>(`/api/v1/futures/position/?coin=ETHUSDT`)
      .then((response) => {
        setPosition(response.data);
      });
  }

  useInterval(getPosition, 1000);

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Box>
          <Title>Long Position</Title>
          <TextContainer>
            <Text>Entry Price</Text>
            <Data>{parseFloat(position.longEnteryPrice).toFixed(2)}</Data>
          </TextContainer>
          <TextContainer>
            <Text>Mark Price</Text>
            <Data>{parseFloat(position.longMarkPrice).toFixed(2)}</Data>
          </TextContainer>{" "}
          <TextContainer>
            <Text>Percent</Text>
            <Data>
              {(
                ((parseFloat(position.longMarkPrice) -
                  parseFloat(position.longEnteryPrice)) /
                  parseFloat(position.longEnteryPrice)) *
                100
              ).toFixed(3)}
            </Data>
          </TextContainer>
          <TextContainer>
            <Text>Amount</Text>
            <Data>{position.longPositionAmt}</Data>
          </TextContainer>
        </Box>
        <Box>
          <Title>Short Position</Title>
          <TextContainer>
            <Text>Entry Price</Text>
            <Data>{parseFloat(position.shortEnteryPrice).toFixed(2)}</Data>
          </TextContainer>
          <TextContainer>
            <Text>Mark Price</Text>
            <Data>{parseFloat(position.shortMarkPrice).toFixed(2)}</Data>
          </TextContainer>
          <TextContainer>
            <Text>Percent</Text>
            <Data>
              {(
                ((parseFloat(position.shortEnteryPrice) -
                  parseFloat(position.shortMarkPrice)) /
                  parseFloat(position.shortEnteryPrice)) *
                100
              ).toFixed(3)}
            </Data>
          </TextContainer>
          <TextContainer>
            <Text>Amount</Text>
            <Data>{position.shortPositionAmt}</Data>
          </TextContainer>
        </Box>
      </Wrapper>
    </Container>
  );
}

export default Home;
