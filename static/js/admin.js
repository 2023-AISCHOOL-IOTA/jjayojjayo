// 다운로드 하이퍼 링크에 클릭 이벤트 발생 시 saveCSV 함수를 호출하도록 이벤트 리스터를 추가
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('csvdownload').addEventListener('click', function(){
        saveCSV('data.csv'); // csv 파일 다운로드 함수 호출
        return false;
    })
});

// csv 생성 함수
function saveCSV(fileName){
    // csv 문자열 생성
    let downlink = document.querySelector('#csvdownload'); // id를 선택하는 것이므로 #을 추가
    let csv = '\uFEFF'; // UTF-8의 BOM(Byte Order Mark)을 추가
    let rows = document.querySelectorAll('#csvtable tr'); // 테이블에서 행 요소들을 모두 선택

    // 행 단위 루핑
    for (var i = 0; i < rows.length; i++) {
        let cells = rows[i].querySelectorAll('td, th');
        let row = [];
        // 행의 셀 값을 배열로 얻기
        cells.forEach(function(cell){
            row.push(cell.innerHTML);
        });

        csv += row.join(',') + (i != rows.length-1 ? '\n' : ''); // 배열은 문자열 + 줄바꿈으로 변환
    }

    // csv 파일 저장
    csvFile = new Blob([csv], {type: 'text/csv;charset=utf-8;'}); // 생성한 csv 문자열을 Blob 데이터로 생성
    downlink.href = window.URL.createObjectURL(csvFile); // Blob 데이터를 URL 객체로 감싸 다운로드 하이퍼 링크에 붙임
    downlink.download = fileName; // 인자로 받은 다운로드 파일명을 지정
}

