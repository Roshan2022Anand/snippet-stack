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
        <div className="w-[85%] max-w-[700px] mx-auto">
          <article className="flex justify-between p-1">
            <div className="flex flex-col gap-2">
              <div className="w-[50px] h-[15px] skeliton-parent">
                <Skeliton />
              </div>
              <div className="w-[40px] h-[10px]  skeliton-parent">
                <Skeliton />
              </div>
              <div className="w-[60px] h-[8px]  skeliton-parent">
                <Skeliton />
              </div>
            </div>
            <div className="flex gap-2">
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
