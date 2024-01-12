import * as THREE from "../build/three.module.js"; // three.js를 모듈 버전으로 임포트 하고있음 모두 다 불러오는것 import * as 작명
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "../examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../examples/jsm/geometries/TextGeometry.js";
// import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
// 사용자가 마우스르 회전 시키기 위한 클래스

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divcontainer = divContainer;
		// 필드로 정의한 이유는 divContainer를 this._divContainer로 다른 method에서 참조 할 수 있도록 하기 위해서이다.

		// renderer를 생성하는 코드
		const renderer = new THREE.WebGL1Renderer({ antialias: true });
		// renderer 객체는 three.js의 WebGL1Renderer라는 클래스로 생성이 가능하다. 생성할 때 다양한 옵션 선택가능 antialias를 활성화 시키면 3차원 장면이 렌더링 될 때 오프젝트들의 경계선이 계산 현상없이 부드럽게 표현된다.
		renderer.setPixelRatio(window.devicePixelRatio);
		// renderer 객체에 setPixelRatio method를 호출해서 픽셀의 ratio 값을 정의하고 설정하고 있다. PixelRatio값은 window의 devicePixelRatio속성으로 쉽게 얻을 수있다. 배율 및 레이아웃 값
		divContainer.appendChild(renderer.domElement);
		// renderer의 domElement를 id가 webgl-container인 divContainer의 자식으로 추가한다.
		// renderer.domElement canvas타입의 dom객체임
		this._renderer = renderer;
		//renderer가 다른 method에서 참조할 수있도록 this._renderer로 정의

		const scene = new THREE.Scene();
		// scene객체를 생성하는데 이것은 three.js 라이브러리에서 scene 클래스로 간단히 생성 할 수있다.
		this._scene = scene;
		// scene객체를 필드화 App클래스의 다른 method에서도 참조할 수 있도록 함.

		this._setupCamera();
		// 카메라 객체 구성
		this._setupLight();
		// ligjt를 설정
		this._setupModel();
		// 3차원 모델을 설정하는 것
		this._setupControls();
		// 컨트롤 클래스 추가히기위한 코드 orbitcontrols와 같은 컨트롤들을 정의하는데 사용하는 메서드이다.

		// 밑줄로 시작하는 이유는 밑줄로 시작하는 field와 method는 이 App 클래스 내부에서만 사용되는 private field, private method라는 의미이다. 자바스크립트에서는 클래스를 정의  할 때 private 성격을 부여할 수있는 기능이 없다. 하지만 밑줄로 시작함으로써 개발자들간의 약속이다. 그럼으로 app 클래스 외부에서는 밑줄로 시작하는 field 또는 method를 호출해서는 안된다.

		window.onresize = this.resize.bind(this);
		// 창 크기가 변경되면 발생하는 onresize 이벤트에 이 클래스의 resize method를 지정하고 있다.
		// resize이벤트에 resize method를 지정할 때 bind를 사용해서 지정하고 있는데 그 이유는 resize method안에서 this가 가르키는 객체가 이벤트 객체가 아닌 이 App 클래스의 객체가 되도록 하기 위해서이다.
		this.resize();
		// resize이밴트가 필요한 이유는 renderer나 camera는 창 크기가 변경될 때 마다 그 크기에 맞게 속성 값을 재 설정 해줘야하기 때문이다.
		// resize method를 창 크기가 변경될 떄 발생하는 이벤트와 함께 하고 있는데 resize이벤트와는 상관없이 생성자에서 한 번 무조건적으로 호출하고 있는데 이렇게 함으로써 renderer와 camera의 창 크기에 맞게 설정해주게 된다.

		requestAnimationFrame(this.render.bind(this));
		// render method를 requestAnimationFrame이라는 API에 넘겨줘서 호출하고 있다. render method는 실제로 3차원 그래픽 장면을 만들어 주는 method인데 이 method를 requestAnimationFrame에 넘겨줌으로써 적당한 시점에 또한 최대한 빠르게 이 render method를 호출해준다. render method를 bind를 통해서 넘겨주는데 그 이유는 render method의 코드 안에서 사용되는 this가 바로 이 app클래스의 객체를 가르키도록 하기 위함이다.₩
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divcontainer);
	}
	// OrbitControls 객체를 생성할 때는 카메라 객체와 마우스 이벤트를 받는 DOM 요소가 필요하다.

	_setupCamera() {
		// three.js가 3차원 그래픽을 출력할 영역에 대한 가로와 세로에 대한 크기를 얻어온다.
		const width = this._divcontainer.clientWidth;
		const height = this._divcontainer.clientHeight;
		// 이 크기를 이용하여 camera 객체를 생성하고 있다.
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		// 생성한 카메라 객체를 또 다른 method에서 사용할 수 있도록 this._camera라는 field로 정의하고있다.

		// 실행되자마자 적당한 크기의 Mesh를 보려면 시점을 증가시켜주면된다.
		camera.position.x = -15;
		camera.position.z = 15;
		this._camera = camera;
	}

	// 광원생성
	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		// color값과 intensity값을 이용하여 광원을 생성.
		const light = new THREE.DirectionalLight(color, intensity);
		// 광원의 위치 잡기
		light.position.set(-1, 2, 4);
		// 생성한 광원을 scene 객체의 구성요소로 추가.
		this._scene.add(light);
	}

	_setupModel() {
		// TextGeometry
		const fontLoader = new FontLoader();
		async function loadFont(that) {
			const url = "../examples/fonts/helvetiker_bold.typeface.json";
			const font = await new Promise((resolve, reject) => {
				fontLoader.load(url, resolve, undefined, reject);
			});

			// 함수 내부에서 geometry를 생성하고 있기 때문에 기존의 코드들도 비동기 코드 안에 작성해야 문제가 없다.
			// TextGeometry는 3차원 mesh로 생성할 문자열을 첫번째 인자로 받는다.
			const geometry = new TextGeometry("positive", {
				font: font, //fontloader를 통해서 얻어온 폰트 객체
				size: 7, //font mesh의 크기
				height: 7, //기본값
				curveSegments: 2, //하나의 커브를 구성하는 정점의 개수
				// setting for ExtrudeGeometry
				bevelEnabled: true, //베벨링 처리를 할 것인지
				bevelThickness: 3, //베벨링에 대한 두께
				bevelSize: 1, // shape의 외각선으로부터 얼마나 멀리 베벨링 할 것인지
				bevelSegments: 3, //베벨링 단계수
			});

			const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
			const cube = new THREE.Mesh(geometry, fillMaterial);
			// 회색 색상의 재질을 이용하여 mesh 타입의 오브젝트를 생성하고 있다.

			const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
			// 노란색의 색에대한 재질을 만듬
			const line = new THREE.LineSegments(
				new THREE.WireframeGeometry(geometry),
				lineMaterial
				// 이 재질과 앞서 만들어 놓은 지오메트리를 이용해 line 타입의 오브젝트를 만들고 있음.
				// WireframeGeometry는 와이어 프레임 형태로 지오메트리를 표현하기위해 사용된다.이걸 지우고 지오메트리와 lineMaterial만 사용하면 모델의 모든 외곽선이 표시되지 않는다.
			);

			const group = new THREE.Group();
			group.add(cube);
			group.add(line);
			// mesh 오브젝트와 line 오브젝트를 하나의 오브젝트로 다루기 위해 group으로 묶어놓음.

			// that으로 바꿔줘야한다.
			that._scene.add(group);
			that._cube = group;
			// group 객체를 scene에 추가한다.
		}
		loadFont(this);
	}

	// 창크기가 변경될 때 발생하는 이벤트를 통해서 호출되는 resize method
	resize() {
		// this._divcontainer의 크기를 얻어와서 카메라의 속성값을 설정하고, renderer의 크기를 설정해주고 있다.
		const width = this._divcontainer.clientWidth;
		const height = this._divcontainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	// render는 time이라는 인자를 받는데 이 인자는 렌더링이 처음 시작된 이후 경과된 시간값으로 단위가 milli-second이다. time인자를 이용하여 scene의 애니메이션에 이용할 수있다.
	render(time) {
		this._renderer.render(this._scene, this._camera);
		// _renderer가 scene을 카메라의 시점으로 렌더링하라는 코드
		this.update(time);
		// update 메서드를 호출하는데 time인자값을 넘겨주는데 이 메서드 안에서 속성값을 변경하는데 속성값을 변경하면서 애니메이션 효과른 준다.
		requestAnimationFrame(this.render.bind(this));
		// requestAnimationFrame호출하는데 이 코드는 생성자에서 호출했던 코드와 동일 즉 이 코드를 통해서 계속 render method가 반복해 호출되도록한다. 무조건 호출은 아니고 적당한 시점에 빠르게 호출된다는 차이점이 있다.
	}

	// time인자를 받아온다 render 메서드에서 time을 전달해주고
	update(time) {
		time *= 0.001; //second unit milli-second 단위를 second 단위로 바꿔준다.
		// 바뀌어진 시간 값을 this._cube 즉 _setupModel에서 만들어 둔 정육면체 큐브인데 이 큐브에 x y 축에 대한 회전값에 time값을 지정하는데 시간은 계속 변하므로 x, y축으로 큐브가 회전한다.
		// 자동회전 코드
		//this._cube.rotation.x = time;
		//this._cube.rotation.y = time;
		//time 값은 requestAnimationFrame 함수가 render 함수에 전달해주는 값이다.
	}
}

//App이라는 class 정의
window.onload = function () {
	new App();
};
//window에 onload에서 App 클래스를 생성해주고있다.
//	// BoxGeometry는 가로 세로 깊이의 크기와 함께 가로 세로 깊이 각각에 대한 분할(Segments) 수로 정으된다. 가로 세로 깊이에 대한 분할수는 지정하지 않으면 1이다. 가로 세로 깊이에 대한 크가 모두 1인 지오메트리

//CircleGeometry는 원판 모양의 geometry이고 생성자에 4개의 인자를 받는다. (반지름(기본값1),원판의구성하는 세그먼트수(값이 클수록 더 완전한 원이 됨),시작각도 기본값(0), 연장각도(단위는 radian) 가본값(2pi)

// ConeGeometry는 원뿔 모양임 생성자의 7자리 인자를 받는데 (밑면에 해당되는 원의 반지름크기 기본값=1, 원뿔의 높이 기본값 = 1, 원뿔의 둘레 방향에 대한 분할개수 기본값 = 8, 원뿔의 높이 방향에대한 분할 개수 기본값 = 1, 원뿔 밑면을 열어 놓을 것인지에 대한 여부 기본값은 false, 원뿔의 시작값과 연장값 기본값은 0과 2pi(360도))

//CylinderGeometry 원통형태의 지오멘트리 생성자의 8개의 인자를 받는데(윗 면 반지름, 밑 면 반지름, 원통의 높이 (기본값 1), 원통의 둘레 방향에 대한 분할개수 (기본값 8), 원통의 높이 방향에 대한 분할 개수 (기본값 1), 원통의 높이 방향에 대한 분할개수(기본값 1, 원통의 윗면과 밑면을 열어 놓을것인지(기본값 false), 원뿔의 시작 각 (기본값 0), 원뿔의 연장각 (기본값 2PI))

//SphereGeometry 구 형태의 지오멘트리 (구의 반지름 크기(기본값 1), 수평방향에 대한 분할수 (기본값 32), 수직 방향에 대한 분할 수(기본값 16), 수평 방향에 대한 구의 시작각(기본값)0, 수평 방향에 대한 구의 연장각(기본값 2PI), 수직 방향에다한 시작각(기본값 0), 수직 방향에 대한 연장각(기본값 PI))

//RingGeometry 2차원 형태의 반지 모양 (내부 반지름 값(기본값 0.5), 외부 반지름 값(기본값 1), 가장자리 둘레 방향으로의 분할 수(기본값 32), 내부 방향에 대한 분할수(기본값 1), 시작각(0), 연장각(2PI))

//PlaneGeometry 2차원 형태의 사각형 (너비에대한 길이(기본값 1), 높이에 대한 길이(기본값 1), 너비 방향에 대한 분할 수(기본값 1), 높이 방향에 대한 분할 수(기본값 1)) 지리정보 시스템, 즉 GIS에서 3차원 지형 등을 표현하는데 유용하게 사용된다.

//TorusGeometry 3차원 반지 모양 (토러스의 반지름(기본값 1),원통의 반지름 값(기본값 0.4), 토러스의 방사 방향에 대한 분할 수(기본값 8),) 토서르는 긴 원통으로 한 바퀴 즉 360도 한바퀴가 돌아서 이어지고 있다. 원통의 반지름 값, 토레스에 대한 긴 원통의 분할 수(기본 값 6), 토러스이 연장각(기본갑 2pi)) 시작각이 따로 없고 연장각의 길이만 받는다.

//TorusKnotGeometry 활용도가 떨어진다()

//ExtrudeGeometry
// 	const x = -2.5,
// 	y = -5;
// const shape = new THREE.Shape();
// shape.moveTo(x + 2.5, y + 2.5);
// shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
// shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
// shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
// shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
// shape.bezierCurveTo(x + 7.7, y + 1, x + 7, y, x + 5, y);
// shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

// // ExtrudeGeometry객체를 생성할 때 shape와 setting 객체를 넘겨주고 있다.
// const settings = {
// 	steps: 2, //깊이 방향의 수
// 	depth: 7, //깊이값
// 	bevelEnabled: true, //베벨링 처리를 할 것인지 기본값은 true
// 	bevelThickness: 2, //베벨링의 두께값
// 	bevelSize: 0.8, //shape의 외각선으로부터 얼마나 멀리 베벨링 할 것인지의 거리 숫자를 크게 키울수록 안쪽으로 말림
// 	bevelSegments: 9, //베벨링 단계수
// };

// const geometry = new THREE.ExtrudeGeometry(shape, settings);

//LatheGeometry
// LatheGeometry 선을 y축으로 회전시켜 생성되는 3차원 매쉬를 얻기 위해 LatheGeometry를 사용한다.
// _setupModel() {
// 	const points = [];
// 	for (let i = 0; i < 10; ++i) {
// 		points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
// 	}

// 	const geometry = new THREE.LatheGeometry(points, 7, 0, Math.PI);
// 	//LatheGeometry는 생성자의 인자로 회전시킬 대상에 대하 좌표 배열 뿐만 아니라 3개의 인자를 더 받는데(points, 분할수(기본값 12), 시작각도(0),연장각도(2pi))
// 	const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
// 	const cube = new THREE.Mesh(geometry, fillMaterial);
// 	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
// 	const line = new THREE.LineSegments(
// 		new THREE.WireframeGeometry(geometry),
// 		lineMaterial
// 	);

// 	const group = new THREE.Group();
// 	group.add(cube);
// 	group.add(line);

// 	this._scene.add(group);
// 	this._cube = group;
// }

// 	// curve의 크기
// 	const path = new CustomsinCurve(4);

// 	const geometry = new THREE.BufferGeometry();
// 	// 좀 더 부드러운 곡선을 얻고자 한다면 CustomSinCurve클래스의 getPoints 매서드의 인자에 적당한 정수 값을 지정하면 된다 (기본값 5).
// 	const points = path.getPoints(30);
// 	geometry.setFromPoints(points);

// 	const material = new THREE.LineBasicMaterial({ color: 0xfff00 });
// 	const line = new THREE.Line(geometry, material);

// 	this._scene.add(line);
// }

// shape에 대한 setupModel 클래스 선언
// _setupModel() {
// 	const shape = new THREE.Shape();
// 	// (x,y)좌표를 사용해서 도형을 정의 할 수있다.
// 	shape.moveTo(1, 1);
// 	shape.lineTo(1, -1);
// 	shape.lineTo(-1, -1);
// 	shape.lineTo(-1, 1);
// 	shape.closePath();

// curve에 대한 setupModel 클래스 선언
// _setupModel() {
// 	//CustomsinCurve curve를 t 매개변수 방정식으로 정의한다.
// 	class CustomsinCurve extends THREE.Curve {
// 		constructor(scale) {
// 			super();
// 			this.scale = scale;
// 		}
// 		getPoint(t) {
// 			// getPoint를 통해서 0과 1사이의 t값에 대한 커브의 구성 좌표를 계산할 수있다.
// 			const tx = t * 3 - 1.5;
// 			const ty = Math.sin(2 * Math.PI * t);
// 			const tz = 0;
// 			return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
// 		}
// 	}
