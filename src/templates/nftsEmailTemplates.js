import videoInfo from '@/static-data/videos';
import { getFrameFileName, getFrameName } from '@/utils/frames';

const { SERVER_URL } = process.env;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK;
const NFT_IMAGE_URL = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;
const NFT_IMAGE_EXTENSION = process.env.NEXT_PUBLIC_NFT_IMAGE_EXTENSION;

const getEurPriceString = (price) => `€${price.toFixed(2).replace('.', ',')}`;

const frameTemplate = (frame, netFramePriceEUR) => {
  return `
    <tr>
      <td style="height: 15px"></td>
    </tr>
    <tr>
      <td>
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          align="left"
          valign="top"
        >
          <tbody>
            <tr style="word-break: break-all">
              <td>
                <img
                  alt="${getFrameName(frame)}"
                  src="${NFT_IMAGE_URL}/${getFrameFileName(
    frame
  )}.${NFT_IMAGE_EXTENSION}"
                  width="150"
                  style="
                    display: block;
                    outline: none;
                    border: none;
                    text-decoration: none;
                  "
                />
              </td>
              <td style="vertical-align: top">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  align="left"
                  valign="top"
                >
                  <tbody>
                    <tr>
                      <td style="height: 45px"></td>
                    </tr>
                    <tr>
                      <td style="padding-left: 15px">
                        ${getFrameName(frame)}
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 5px"></td>
                    </tr>
                    <tr>
                      <td
                        style="
                          color: rgb(217, 1, 254);
                          font-family: monospace;
                          font-size: 20px;
                          padding-left: 15px;
                        "
                      >
                        ${getEurPriceString(netFramePriceEUR)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  `;
};

const nftsTemplate = (videosWithFrames, netFramePriceEUR) => {
  const videos = Object.keys(videosWithFrames);
  const templateString = videos.reduce((acc, video, index) => {
    const frames = videosWithFrames[video];

    const videoTitleTemplate = `
      ${
        index > 0
          ? `
                      <tr>
                        <td style="height: 25px"></td>
                      </tr>`
          : ''
      }
      <tr>
        <td
          style="
            color: rgb(255, 0, 0);
            font-family: monospace;
            font-size: 20px;
          "
        >
          <span
            style="
              font-family: monospace;
              font-size: 20px;
              line-height: 14px;
              color: rgb(255, 0, 0);
              word-break: break-all;
            "
            >${videoInfo[video].title}</span
          >
          | ${videoInfo[video].subtitle}
        </td>
      </tr>`;

    const framesTemplateString = frames.reduce((frameAcc, frame) => {
      return frameAcc.concat(frameTemplate(frame, netFramePriceEUR));
    }, '');

    const newAcc = acc.concat(videoTitleTemplate).concat(framesTemplateString);
    return newAcc;
  }, '');

  return templateString;
};

export const nftsPurchasedTemplate = (data) => {
  const { order } = data;
  const {
    confirmationKey,
    customer,
    framePriceEUR,
    netPriceEUR,
    paymentMethod,
    totalPriceEUR,
    transactionHash,
    vat,
  } = order;
  const {
    addressLine1,
    addressLine2,
    city,
    country,
    firstName,
    postalCode,
    region,
  } = customer;
  const { frames, failedFrames } = data;

  const isWalletPayment = paymentMethod === 'WALLET';

  const videosWithFrames = frames.reduce((acc, frame) => {
    if (!acc[frame.video]) {
      acc[frame.video] = [];
    }
    acc[frame.video].push(frame);
    return acc;
  }, {});

  let videosWithFailedFrames;
  if (failedFrames && failedFrames.length > 0) {
    videosWithFailedFrames = failedFrames.reduce((acc, frame) => {
      if (!acc[frame.video]) {
        acc[frame.video] = [];
      }
      acc[frame.video].push(frame);
      return acc;
    }, {});
  }

  const netFramePriceEUR = parseFloat((framePriceEUR / (1.0 + vat)).toFixed(2));
  const link = isWalletPayment
    ? `https://${
        NETWORK !== 'mainnet' ? `${NETWORK}.` : ''
      }etherscan.io/tx/${transactionHash}`
    : `${SERVER_URL}/claim-nfts?confirmation-key=${confirmationKey}`;

  return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NFTs Purchased</title>
          <style type="text/css">
            body {
              background-color: #1d1d1d;
            }
          </style>
        </head>
        <body style="background-color: #1d1d1d; font-family: 'Arial, sans-serif'; margin: 0px; padding: 0px; text-size-adjust: 100%; width: 100%;">
          <table
            width="100%"
            height="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            align="left"
            valign="top"
            style="background-color: #1d1d1d; color: #e5e5e5;"
          >
            <tbody>
              <tr>
                <td align="center" valign="top">
                  <table
                    width="auto"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    valign="top"
                    style="padding: 15px"
                  >
                    <tbody>
                      <tr>
                        <td style="height: 45px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <span
                            style="
                              font-family: monospace;
                              font-size: 24px;
                              line-height: 14px;
                              color: rgb(255, 255, 255);
                            "
                            >Fairytales &amp; Conspiracies</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 50px"></td>
                      </tr>
                      <tr>
                        <td style="font-family: inherit; text-align: center">
                          <span
                            style="
                              font-family: monospace;
                              font-size: 24px;
                              font-weight: bold;
                              line-height: 1.1;
                              color: rgb(217, 1, 254);
                            "
                            >THANK YOU FOR<br />YOUR PURCHASE!</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          Your payment was successful.
                        </td>
                      </tr>
                      ${
                        isWalletPayment
                          ? `
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">Your transaction link</td>
                      </tr>
                      <tr>
                        <td style="height: 15px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <a
                            href="${link}"
                            target="_blank"
                            style="
                              color: rgb(0, 104, 255);
                              text-decoration: underline;
                              word-break: break-word;
                            "
                            >${link}</a
                          >
                        </td>
                      </tr>`
                          : `<tr>
                        <td style="height: 15px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          Once you have your wallet set up follow the provided link to
                          access the purchased NFTs and complete the transfer.
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">Your link</td>
                      </tr>
                      <tr>
                        <td style="height: 15px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <a
                            href="${link}"
                            target="_blank"
                            style="
                              color: rgb(0, 104, 255);
                              text-decoration: underline;
                              word-break: break-word;
                            "
                            >${link}</a
                          >
                        </td>
                      </tr>`
                      }
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; text-align: center">
                          You can view the details of your purchase below.
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 50px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: left">
                          Hi, ${firstName}!<br />Thank you for purchasing your NFTs with us.
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="font-family: monospace; text-align: center">
                          SHIPPING INFO
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 10px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">${addressLine1}</td>
                      </tr>
                      ${
                        addressLine2
                          ? `<tr>
                        <td style="text-align: center">${addressLine2}</td>
                      </tr>`
                          : ''
                      }
                      <tr>
                        <td style="text-align: center">${city}, ${postalCode}</td>
                      </tr>
                      ${
                        region
                          ? `<tr>
                        <td style="text-align: center">${region}</td>
                      </tr>`
                          : ''
                      }
                      <tr>
                        <td style="text-align: center">${country}</td>
                      </tr>
                      ${
                        frames && frames.length > 0
                          ? `<tr>
                        <td style="height: 50px"></td>
                      </tr>
                      ${nftsTemplate(videosWithFrames, netFramePriceEUR)}`
                          : ''
                      }
                      ${
                        failedFrames && failedFrames.length > 0
                          ? `<tr>
                        <td style="height: 50px"></td>
                      </tr>
                      <tr>
                        <td>
                          There has been an issue with the following frames and you will not be able to claim them. Please contact us at support@fairytalesandconspiracies.art to resolve the issue:
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      ${nftsTemplate(videosWithFailedFrames, netFramePriceEUR)}`
                          : ''
                      }
                      <tr>
                        <td style="height: 65px"></td>
                      </tr>
                      <tr>
                        <td>
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            align="left"
                            valign="top"
                          >
                            <tbody>
                              <tr>
                                <td style="color: #e5e5e5">PAYMENT METHOD</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td style="color: #e5e5e5">NFT TOTAL</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td style="color: #e5e5e5">SUBTOTAL</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td style="color: #e5e5e5">SHIPPING</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td style="color: #e5e5e5">TOTAL incl. VAT</td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            align="right"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            valign="top"
                            style="text-align: right"
                          >
                            <tbody>
                              <tr>
                                <td>${
                                  isWalletPayment
                                    ? 'Wallet'
                                    : 'Debit/credit card'
                                }</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td>${frames.length}</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td>${getEurPriceString(netPriceEUR)}</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td>Free</td>
                              </tr>
                              <tr>
                                <td style="height: 10px"></td>
                              </tr>
                              <tr>
                                <td>${getEurPriceString(totalPriceEUR)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      ${
                        isWalletPayment
                          ? ''
                          : `<tr>
                          <td style="text-align: center">
                            <a
                              href="${SERVER_URL}/claim-nfts?confirmation-key=${confirmationKey}"
                              target="_blank"
                              style="
                                color: rgb(229, 229, 229);
                                text-decoration: none;
                                background-color: rgb(29, 29, 29);
                                border: 3px solid red;
                                -webkit-border-radius: 15px;
                                -moz-border-radius: 15px;
                                border-radius: 15px;
                                cursor: pointer;
                                display: inline-block;
                                font-family: monospace;
                                font-size: 24px;
                                font-weight: 400;
                                padding: 5px 20px;
                              "
                              >Claim your NFTs</a
                            >
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 35px"></td>
                        </tr>`
                      }
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
`;
};

export const nftsClaimedTemplate = (data) => {
  const { order, walletAddress } = data;
  const { claimedTransactionHash, framePriceEUR, vat } = order;
  const { frames, failedFrames } = data;

  const link = `https://${
    NETWORK !== 'mainnet' ? `${NETWORK}.` : ''
  }etherscan.io/tx/${claimedTransactionHash}`;

  const videosWithFrames = frames.reduce((acc, frame) => {
    if (!acc[frame.video]) {
      acc[frame.video] = [];
    }
    acc[frame.video].push(frame);
    return acc;
  }, {});

  let videosWithFailedFrames;
  if (failedFrames && failedFrames.length > 0) {
    videosWithFailedFrames = failedFrames.reduce((acc, frame) => {
      if (!acc[frame.video]) {
        acc[frame.video] = [];
      }
      acc[frame.video].push(frame);
      return acc;
    }, {});
  }

  const netFramePriceEUR = parseFloat((framePriceEUR / (1.0 + vat)).toFixed(2));

  return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NFTs Purchased</title>
          <style type="text/css">
            body {
              background-color: #1d1d1d;
            }
          </style>
        </head>
        <body style="background-color: #1d1d1d; font-family: 'Arial, sans-serif'; margin: 0px; padding: 0px; text-size-adjust: 100%; width: 100%;">
          <table
            width="100%"
            height="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            align="left"
            valign="top"
            style="background-color: #1d1d1d; color: #e5e5e5;"
          >
            <tbody>
              <tr>
                <td align="center" valign="top">
                  <table
                    width="auto"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    valign="top"
                    style="padding: 15px"
                  >
                    <tbody>
                      <tr>
                        <td style="height: 45px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <span
                            style="
                              font-family: monospace;
                              font-size: 24px;
                              line-height: 14px;
                              color: rgb(255, 255, 255);
                            "
                            >Fairytales &amp; Conspiracies</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 50px"></td>
                      </tr>
                      <tr>
                        <td style="font-family: inherit; text-align: center">
                          <span
                            style="
                              font-family: monospace;
                              font-size: 24px;
                              font-weight: bold;
                              line-height: 1.1;
                              color: rgb(217, 1, 254);
                            "
                            >YOU HAVE CLAIMED<br />YOUR NFTS!</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          The NFTs have been transferred to the following address:<br />${walletAddress}
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">Your transaction link</td>
                      </tr>
                      <tr>
                        <td style="height: 15px"></td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <a
                            href="${link}"
                            target="_blank"
                            style="
                              color: rgb(0, 104, 255);
                              text-decoration: underline;
                              word-break: break-word;
                            "
                            >${link}</a
                          >
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 50px"></td>
                      </tr>
                      ${
                        frames && frames.length > 0
                          ? `<tr>
                        <td style="height: 50px"></td>
                      </tr>
                      ${nftsTemplate(videosWithFrames, netFramePriceEUR)}`
                          : ''
                      }
                      ${
                        failedFrames && failedFrames.length > 0
                          ? `<tr>
                        <td style="height: 50px"></td>
                      </tr>
                      <tr>
                        <td>
                          There has been an issue with the following frames and they have not been claimed. Please contact us at support@fairytalesandconspiracies.art if you wish to resolve the issue:
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                      ${nftsTemplate(videosWithFailedFrames, netFramePriceEUR)}`
                          : ''
                      }
                      <tr>
                        <td style="height: 35px"></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
`;
};

export const securityQuestionForgottenTemplate = (data) => {
  const { confirmationKey, walletAddress, file1Url, file2Url } = data;

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Security question forgotten</title>
        <style type="text/css">
          body {
            background-color: #1d1d1d;
          }
        </style>
      </head>
      <body style="background-color: #1d1d1d; font-family: 'Arial, sans-serif'; margin: 0px; padding: 0px; text-size-adjust: 100%; width: 100%;">
        <table
          width="100%"
          height="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          align="left"
          valign="top"
          style="background-color: #1d1d1d; color: #e5e5e5;"
        >
          <tbody>
            <tr>
              <td align="center" valign="top">
                <table
                  width="auto"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  valign="top"
                  style="padding: 15px"
                >
                  <tbody>
                    <tr>
                      <td style="height: 45px"></td>
                    </tr>
                    <tr>
                      <td style="text-align: center">
                        <span
                          style="
                            font-family: monospace;
                            font-size: 24px;
                            line-height: 14px;
                            color: rgb(255, 255, 255);
                          "
                          >Fairytales &amp; Conspiracies</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 50px"></td>
                    </tr>
                    <tr>
                      <td style="font-family: inherit; text-align: center">
                        <span
                          style="
                            font-family: monospace;
                            font-size: 24px;
                            font-weight: bold;
                            line-height: 1.1;
                            color: rgb(217, 1, 254);
                          "
                          >SOMEONE SAYS<br />THEY FORGOTTEN THE ANSWER TO THEIR SECURITY QUESTION!</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 35px"></td>
                    </tr>
                    <tr>
                      <td style="text-align: center">
                        <b>Information provided:</b>
                        <br />confirmationKey: ${confirmationKey}
                        <br />walletAddress: ${walletAddress}
                        <br />
                        <br /><b>In this email you can find the following files attached:</b>
                        <br />file1Url: ${file1Url}
                        <br />file2Url: ${file2Url}
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 50px"></td>
                    </tr>
                    <tr>
                      <td style="height: 35px"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
};
