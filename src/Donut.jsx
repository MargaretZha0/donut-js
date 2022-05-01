import React, { useRef, useEffect, useCallback } from 'react'

const Donut = () => {
  
    const canvasRef = useRef(null)

    const polygon = [
        // [-1, -1, -1],
        // [-1, -1, 1],
        // [-1, 1, -1],
        // [-1, 1, 1],
    
        // [1, -1, -1],
        // [1, -1, 1],
        // [1, 1, -1],
        // [1, 1, 1],
    ]

    const pointSize = 2

    const draw = useCallback((ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // console.log(frameCount)
        const scale = 10 + Math.abs(Math.cos(frameCount  * 0.02) * 15)

        const xr = frameCount * 0.01
        const yr = frameCount * 0.02
        const zr = frameCount * 0.03

        const rx = [
            [1, 0, 0],
            [0, Math.cos(xr), -Math.sin(xr)],
            [0, Math.sin(xr), Math.cos(xr)],
        ]


        const ry = [
            [Math.cos(yr), 0, Math.sin(yr)],
            [0, 1, 0],
            [-Math.sin(yr), 0, Math.cos(yr)],
        ]

        const rz = [
            [Math.cos(zr), -Math.sin(zr), 0],
            [Math.sin(zr), Math.cos(zr), 0],
            [0, 0, 1]
        ]

        for (let i = 0; i < polygon.length; i++) {
            const p = polygon[i]
            
            // console.log(rx[0][0])
            const px1 = rx[0][0] * p[0] + rx[0][1] * p[1] + rx[0][2] * p[2]
            const py1 = rx[1][0] * p[0] + rx[1][1] * p[1] + rx[1][2] * p[2]
            const pz1 = rx[2][0] * p[0] + rx[2][1] * p[1] + rx[2][2] * p[2]

            const px2 = ry[0][0] * px1 + ry[0][1] * py1 + ry[0][2] * pz1
            const py2 = ry[1][0] * px1 + ry[1][1] * py1 + ry[1][2] * pz1
            const pz2 = ry[2][0] * px1 + ry[2][1] * py1 + ry[2][2] * pz1

            const px3 = rz[0][0] * px2 + rz[0][1] * py2 + rz[0][2] * pz2
            const py3 = rz[1][0] * px2 + rz[1][1] * py2 + rz[1][2] * pz2
            const pz3 = rz[2][0] * px2 + rz[2][1] * py2 + rz[2][2] * pz2

            ctx.beginPath()
            ctx.arc(px3 * scale + 375, py3 * scale + 275, pointSize, 0, 2*Math.PI)
            ctx.fill()
        }
        
    }, [polygon])

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const R1 = 4
        const R2 = 8

        for (let theta = 0; theta < 2 * Math.PI; theta += 0.4) {
            for (let phi = 0; phi < 2 * Math.PI; phi += 0.15) {
                const x = (R2 + R1 * Math.cos(theta)) *Math.cos(phi)
                const y = R1 * Math.sin(theta)
                const z = (R2 + R1 * Math.cos(theta)) * Math.sin(phi)
                polygon.push([x, y, z])
            }
        }

        //Our draw came here
        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
        window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])


    return <canvas width='800' height='600' ref={canvasRef}/>
  }

export default Donut



