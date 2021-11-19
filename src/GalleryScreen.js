import {useEffect, useState} from 'react'
import { Button} from "@material-ui/core";
import NFTS from './info.json'
import styled from "styled-components";
import {Link} from 'react-router-dom'
import axios from 'axios'
const ShowMoreButton = styled(Button)``;

const GalleryScreen = () => {
    const [nfts, setNfts] = useState([])
    const [offset, setOffset] = useState(0)

    const fetchNfts = async(offs) => {
        if(NFTS.items){
            Object.values(NFTS.items).slice(offs, offs+2).map(async (item)=>{
                const response = await axios.get(item.link)
                setNfts(old=> [...old,response.data])
            })
        }
    }
    useEffect(()=>{
        fetchNfts(0)
    },[])
  return (
    <section className="main-section">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="container">
        <div className="text-center">
          <Link to='/'><img className="logo" src="/assets/img/logo3.png" /></Link>
        </div>
        <div className="main-box p-3 mb-5">
        <div className="text-center">
         <h1 className='gallery-title'>HipHop Collection</h1>
        </div>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              {
                  nfts && nfts.map((nft)=>(
                    <img className="slider-img" src={nft.image} />
                  ))
              }
          </div>
          <div className='text-center mt-3'>
          <ShowMoreButton onClick={()=> {
              setOffset(old=> old+2)
              fetchNfts(offset+2)
          }} variant="contained">Show More</ShowMoreButton>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GalleryScreen;
