<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * @method static create(array $array)
 */
class SchedulesResultImg extends Model
{
    private const _STD_FOR_RES_RESULT_SUCCESS = "스케줄 출석 결과 입력을 성공하였습니다.";
    private const _STD_FOR_RES_RESULT_FAILURE = "스케줄 출석 결과 입력에 실패하였습니다.";
    private const _STD_FOR_RES_RESULT_COMPLETED = "이미 결과 입력이 완료되어 수정 불가능합니다.";

    protected $primaryKey = 'sch_id';

    protected $fillable = [
        'sch_id',
        'start_img_url',
        'end_img_url'
    ];

    /**
     * DB 에 이미지 파일 경로 저장
     *
     * @param array $store_data
     * @return JsonResponse
     */
    public function store_result_img_url(
        array $store_data
    ): JsonResponse {
        try {
            self::create($store_data);
        } catch (QueryException $queryException) {
            switch ($queryException->getCode()) {
                case 23000:
                    return
                        Controller::response_json(self::_STD_FOR_RES_RESULT_COMPLETED, 202);
                default:
                    return
                        Controller::response_json(self::_STD_FOR_RES_RESULT_FAILURE, 422);
            }
        }

        return
            Controller::response_json(self::_STD_FOR_RES_RESULT_SUCCESS, 201);
    }

    /*
     * 결과 조회 시, 스케줄 아이디로 이미지 url 조회
     */
    public function get_img($img_name)
    {
        $img_url = 'http://' . request()->getHttpHost() . Storage::url('public/' . $img_name);       /* 이미지 URL */
        return $img_url;
    }

    public function get_base64_img($img_name)
    {
        $data = Storage::get('public/' . $img_name);
        $type = pathinfo('storage/' . $img_name, PATHINFO_EXTENSION);

        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }
}
