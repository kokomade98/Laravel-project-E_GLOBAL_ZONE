import React, {useEffect, useState, useRef} from "react";
import Modal from "components/common/modal/Modal";
import ConfirmStudent from "components/common/modal/ConfirmStudent";
import useClick from "modules/hooks/useClick";
import ConfirmRestriction from "../../../../components/common/modal/ConfirmRestriction";
import ConfirmUnrestriction from "../../../../components/common/modal/ConfirmUnrestriction";
import useModal from "../../../../modules/hooks/useModal";
import useAxios from "../../../../modules/hooks/useAxios";
import {selectDept} from "../../../../redux/confSlice/confSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectData, setData} from "../../../../redux/managerSlice/managerSlice";
import conf from "../../../../conf/conf";


class Student {
    dept;
    std_id;
    name;
    status;
    ph;
    count;
    absent;
    e_mail;

    /**
     * Student Constructor
     * @param {int} dept std_kor_dept
     * @param {int} std_id std_kor_id
     * @param {string} name std_kor_name
     * @param {boolean} status std_kor_state_of_restriction
     * @param {string} ph std_kor_phone
     * @param {string} e_mail std_kor_mail
     * @param {int} count std_kor_num_of_attendance
     * @param {int} absent std_kor_num_of_absent
     * @param {array} deptList state.conf.dept
     */
    constructor(dept, std_id, name, status, ph, e_mail, count, absent, deptList) {
        this.std_id = std_id;
        this.name = name;
        this.status = status;
        this.ph = ph;
        this.e_mail = e_mail;
        this.count = count;
        this.absent = absent;
        this._dept = deptList[dept - 1];
    }

    get dept() {
        return this._dept;
    }
}

class Data {
    get sort() {
        return this._sort;
    }

    set sort(value) {
        this._sort = value;
    }

    _sort = null;
    data = [];

    /**
     * Data Constructor
     * @param {[Student]} data
     */
    constructor(data, sort = null) {
        this._sort = sort;
        this.data = data;
    }

}

/**
 * Manager :: 학생관리
 * @returns {JSX.Element}
 * @constructor
 */
export default function Students() {

    // api
    const {loading, data: resData, error} = useAxios({url: conf.url+"/api/admin/korean"});
    // department information
    const dept = useSelector(selectDept);
    const data = useSelector(selectData);
    const dispatch = useDispatch();
    // const [dataSet, setDataSet] = useState();
    // const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const {isOpen: isRestrict, handleOpen: hadleOpenForRestrict, handleClose: handleCloseForRestrict} = useModal();
    const {isOpen: isUnrestrict, handleOpen: handleOpenForUnrestrict, handleClose: handleCloseForUnrestrict} = useModal();

    /**
     * api response done
     */
    useEffect(() => {
        if (resData) {
            console.log(resData);
            let dataArray = [];
            if(resData.data)resData.data.forEach(v => {
                dataArray.push(new Student(v.std_kor_dept, v.std_kor_id, v.std_kor_name, v.std_kor_state_of_restriction, v.std_kor_phone, v.std_kor_mail, v.std_kor_num_of_attendance, v.std_kor_num_of_absent, dept))
            })
            console.log(dataArray);
            dispatch(setData(new Data(dataArray)));
        }
        // setDataSet(new Data(dataArray));
    }, [resData, dept])

    const sort = (sortBy) => {
        if (data.sort === sortBy) {
            setData(new Data(data.data.sort((a, b) => (a[sortBy] > b[sortBy] ? -1 : 1)), null));
        } else {
            setData(new Data(data.data.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)), sortBy));
        }};
    useEffect(() => {
        window.easydropdown.all();
    }, []);


    return (
        <div className="content">
            <div className="sub_title">
                <div className="top_semester">
                    <p className="tit">한국인 학생 관리</p>
                    <select name="catgo" className="dropdown">
                        <option>2020학년도 1학기</option>
                        <option>2020학년도 여름학기</option>
                        <option>2020학년도 2학기</option>
                        <option>2020학년도 겨울학기</option>
                    </select>
                </div>

                <div className="top_search">
                    <select name="catgo" className="dropdown">
                        <option>이름</option>
                        <option>학번</option>
                        <option>연락처</option>
                    </select>
                    <input type="text"/>
                    <input type="submit" value="검색"/>
                </div>
            </div>

            <div className="wrap">
                <div className="scroll_area">
                    <table className="student_manage_table">
                        <colgroup>
                            <col width="10%"/>
                            <col width="12%"/>
                            <col width="15%"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("dept");
                                })}
                            >
                                계열학과
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                            <th scope="col" className="bg">
                                학번
                            </th>
                            <th scope="col" className="bg">
                                이름
                            </th>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("status");
                                })}
                            >
                                이용제한
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                            <th scope="col" className="bg">
                                연락처
                            </th>
                            <th scope="col" className="bg">
                                G Suite 계정
                            </th>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("count");
                                })}
                            >
                                활동 횟수
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                            <th
                                scope="col"
                                className="bg align"
                                ref={useClick(() => {
                                    setData([]);
                                    sort("absent");
                                })}
                            >
                                미참석 횟수
                                <img
                                    src="/global/img/table_align_arrow.gif"
                                    alt="언어 기준 정렬"
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {data && data.data.map((v, index) => (
                            <tr key={v.std_id} className={v.status ? "restriction_on" : ""}>
                                <td>{typeof v.dept === "object" ? v.dept.dept_name[0] : ""}</td>
                                <td>{v.std_id}</td>
                                <td
                                    className="name"
                                    onMouseOver={() => {
                                        document.getElementById(`hover_btn_${index}`).className = "hover_btn kor"
                                    }}
                                    onMouseOut={() => {
                                        document.getElementById(`hover_btn_${index}`).className = "off"
                                    }}
                                >{v.name}
                                    <div className="off" id={`hover_btn_${index}`}>
                                        <div className="area">
                                            <div className="navy">비밀번호 초기화</div>
                                            {v.status ?
                                                <>
                                                    <div className="mint" onClick={
                                                        handleOpenForUnrestrict
                                                    }>이용제한 해제
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="mint" onClick={
                                                        hadleOpenForRestrict
                                                    }>이용제한
                                                    </div>
                                                </>
                                            }
                                            <div className="lightGray">삭제</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {v.status ? (
                                        <div className="restriction">
                                            <img
                                                src="/global/img/restriction_on.png"
                                                alt="이용제한"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="restriction">
                                            <img
                                                src="/global/img/restriction_off.png"
                                                alt="이용제한 해제"
                                            />
                                        </div>
                                    )}
                                </td>
                                <td>{v.ph}</td>
                                <td>{v.e_mail}</td>
                                <td>{v.count}회</td>
                                <td>{v.absent}회</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="table_btn">
                    <div
                        ref={useClick(() => {
                            setIsOpen(true);
                        })}
                    >
                        신청 승인
                    </div>
                    <div
                        ref={useClick(function () {
                            alert("엑셀 다운");
                        })}
                    >
                        CSV 다운
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                hadleClose={() => {
                    setIsOpen(false);
                }}
            >
                <ConfirmStudent
                    handleClose={() => {
                        setIsOpen(false);
                    }}
                />
            </Modal>
            <Modal
                isOpen={isUnrestrict}
                onRequestClose={handleCloseForUnrestrict}
            >
                <ConfirmUnrestriction handleClose={handleCloseForUnrestrict}/>
            </Modal>
            <Modal
                isOpen={isRestrict}
                onRequestClose={handleCloseForRestrict}
            >
                <ConfirmRestriction handleClose={handleCloseForRestrict}/>
            </Modal>
        </div>
    );
}