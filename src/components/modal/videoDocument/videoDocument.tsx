import { ReactElement } from "react";
import "./videoDocument.scss"
import image1 from "../../../assets/img/20240315-234012.jpg"
import image2 from "../../../assets/img//20240315-234020.jpg"

interface IProps {
    showModal: (showModal: boolean) => void
    isShowModal: boolean
}

function VideoDocument({ showModal, isShowModal }: IProps): ReactElement {
    return (
        <div id="videoDocumentBox">
            <div id="videoDocument">
                {isShowModal && (
                    <div id="videoDocumentModal" className="modal-video-document-window">
                        <div className="modal-video-document-content">
                            <div className="video-document-content-box">
                                <div className="video-document-header">
                                    <h4>Recording Document</h4>
                                    <span className="close close-icon infinity-btn" onClick={() => showModal(false)}>
                                        &times;
                                    </span>
                                </div>
                                <div className="video-document-body">
                                    <p className="header">คู่มือการติดตั้งกล้องและเตรียมพื้นที่สำหรับการตรวจสอบท่าทางการเดิน</p>
                                    <p className="header"> การเตรียมพื้นสำหรับกำหนดเส้นทางการเดิน</p>
                                    <p className="primary-number">1. จัดเตรียมพื้นที่สำหรับใช้ในการกำหนดเส้นทางการเดิน อย่างน้อย 6 เมตร โดยแบ่งเป็น</p>
                                    <p className="secondary-number">1.1 เส้นทางเริ่มต้นของการเดิน (เส้นสีส้ม) มีระยะการเดิน 2 เมตร</p>
                                    <p className="secondary-number">1.2 เส้นทางการเดินสำหรับใช้ตรวจสอบ (เส้นสีดำ) มีระยะ การเดิน 4 เมตร</p>
                                    <div className="primary-number"> <p className="remark">หมายเหตุ</p>ระยะการเดินของคนไข้ที่แนะนำ ต้องมีระยะอย่างน้อย 4 เมตร ซึ่งสามารถเพิ่มระยะการเดินได้</div>
                                    <p className="header">การติดตั้งกล้อง</p>
                                    <p className="primary-number">1. ตั้งกล้องสำหรับถ่ายวิดีโอให้มีความสูง เท่ากับ 1 เมตร</p>
                                    <p className="primary-number">2. ตั้งกล้องให้ห่างจากเส้นทางการเดิน 4 เมตร </p>
                                    <p className="primary-number"><p className="remark">หมายเหตุ</p> ระยะห่างระหว่างกล้องกับเส้นทางการเดิน ต้องติดตั้งให้กล้องสามารถจับภาพคนไข้ได้ทั้งตัว ขณะที่ถ่ายวิดีโอการเดิน</p>
                                    <p className="header">การแต่งกาย</p>
                                    <p className="primary-number">1. เสื้อรัดรูป ขนาดพอดีตัว</p>
                                    <p className="primary-number">2. กางเกงขาสั้น</p>
                                    <p className="primary-number">3. รองเท้าผ้าใบ</p>
                                    <p className="primary-number">4. ไม่สวมใส่เครื่องประดับ หรือสิ่งของสวมใส่อื่นๆ เช่น หมวก กระเป๋า</p>
                                    <p className="primary-number"><p className="remark">หมายเหตุ</p> การแต่งกายควรสวมใส่ชุดที่มีสีแตกต่างจากพื้นหลังของห้อง เช่น ห้องมีพื้นหลังสีขาว ควรสวมใส่ชุดที่มีสีดำ หรือสีที่แตกต่างจากสีขาวชัดเจน</p>
                                    <p className="header">สถานที่การเก็บข้อมูล</p>
                                    <p className="primary-number">ห้องปฏิบัติการของโรงเรียนกายอุปกรณ์สิรินธร หรือสถานที่อื่นที่เหมาะสม</p>
                                    <p className="primary-number"><p className="remark">หมายเหตุ</p> สถานที่สำหรับถ่ายวิดีโอการเดินควรมีแสงที่เหมาะสม สามารถมองเห็นคนไข้ขณะเดินได้อย่างชัดเจน</p>
                                    <p className="header">ขณะที่ถ่ายวิดีโอ</p>
                                    <p className="header">การเดิน</p>
                                    <p className="primary-number">เริ่มเดินจากจุดเริ่มต้นของเส้นทางการเดิน (เส้นสีส้ม) เดินเป็นเส้นตรงตามเส้นทางที่กล้องจับภาพได้ (เส้นสีดำ) จนสิ้นสุดระยะของกล้อง (เส้นประสีเทา) โดยจะเดินทั้งหมด 1 รอบ</p>
                                    <p className="header">การถ่ายวิดีโอ</p>
                                    <p className="primary-number">ในการถ่ายวิดีโอการเดินจำเป็นต้องมีคนไข้ในวิดีโอ 1 คนเท่านั้น</p>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
                                            <img src={image1} width={480} height={360} />
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
                                            <img src={image2} width={480} height={360} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoDocument