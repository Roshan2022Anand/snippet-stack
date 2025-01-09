import {
  NavSkeliton,
  Skeliton,
} from '@/components/utility-components/Skelitons';
import React from 'react';

const Loading = () => {
  return (
    <>
      <NavSkeliton />
      <section className="heading">
        <div className="w-[80%] max-w-[1000px] lg:flex flex-row-reverse justify-around gap-1">
          <article className="flex lg:flex-col-reverse lg:justify-evenly lg:w-1/2 justify-between p-1 backdrop-blur-[5px]">
            <div className="flex flex-col gap-2">
              <div className="w-[50px] h-[15px] skeliton-parent">
                <Skeliton />
              </div>
              <div className="w-[40px] h-[10px]  skeliton-parent">
                <Skeliton />
              </div>
              <div className="w-[160px] h-[25px]  skeliton-parent">
                <Skeliton />
              </div>
            </div>
            <div className="flex items-start justify-end lg:flex-row-reverse gap-2">
              <div className="skeliton-parent w-[100px] h-10">
                <Skeliton />
              </div>
              <div
                className="skeliton-parent size-[100px]"
                style={{ borderRadius: '50%' }}
              >
                <Skeliton />
              </div>
            </div>
          </article>
          <div className="w-full h-[500px] skeliton-parent">
            <Skeliton />
          </div>
        </div>
      </section>
    </>
  );
};
export default Loading;
