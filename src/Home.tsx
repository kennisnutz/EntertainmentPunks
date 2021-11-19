import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { Link} from 'react-router-dom'

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

const GalleryButton = styled(Button)``;

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}
SwiperCore.use([Autoplay]);

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <section className="main-section">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className='container'>
      <div className="text-center">
          <img className="logo" src="/assets/img/logo3.png" />
        </div>
        <div className="slider-holder">
          <Swiper
            autoplay
            loop={true}
            breakpoints={{
              // when window width is >= 640px
              500: {
                width: 500,
                slidesPerView: 2,
              },
              // when window width is >= 768px
              768: {
                width: 768,
                slidesPerView: 3,
              },
              1400: {
                width: 1400,
                slidesPerView: 5,
              },
              1000: {
                width: 1000,
                slidesPerView: 4,
              },
              300: {
                width: 300,
                slidesPerView: 1,
              },
            }}
          >
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img1.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img2.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img3.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img4.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img5.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img6.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img7.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img8.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img9.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img className="slider-img" src="/assets/img/img10.png" />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="main-box">
        {wallet && (
          <h1 className="minted-count">{itemsRedeemed} /10</h1>
        )}
                  <p className="price">1 Punk costs 1 Sol</p>
        {wallet && (
        <p className='normal-text'>Wallet :{shortenAddress(wallet.publicKey.toBase58() || "")}</p>
      )}

      {wallet &&  <p className='normal-text'>Balance: {(balance || 0).toLocaleString()} SOL</p>}

          <div className="d-flex align-items-center justify-content-center gap-5 mt-5">
            <GalleryButton variant="contained"><Link to='/gallery'>HipHop Collection</Link></GalleryButton>
            <MintContainer>
        {!wallet ? (
          <ConnectButton >Connect Wallet</ConnectButton>
        ) : (
          <MintButton
            disabled={isSoldOut || isMinting || !isActive}
            onClick={onMint}
            variant="contained"
          >
            {isSoldOut ? (
              "SOLD OUT"
            ) : isActive ? (
              isMinting ? (
                <CircularProgress />
              ) : (
                "MINT"
              )
            ) : (
              <Countdown
                date={startDate}
                onMount={({ completed }) => completed && setIsActive(true)}
                onComplete={() => setIsActive(true)}
                renderer={renderCounter}
              />
            )}
          </MintButton>
        )}
      </MintContainer>
          </div>
          <p className="warning-msg">
            Please make sure you are connected to the right network (Solana
            Network) and the correct address. Please note: Once you make the
            purchase, you cannot undo this action.
          </p>
        </div>
      </div>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
