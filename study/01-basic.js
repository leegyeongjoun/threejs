import * as THREE from "../build/three.module.js"; // three.js를 모듈 버전으로 임포트 하고있음

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

	_setupCamera() {
		// three.js가 3차원 그래픽을 출력할 영역에 대한 가로와 세로에 대한 크기를 얻어온다.
		const width = this._divcontainer.clientWidth;
		const height = this._divcontainer.clientHeight;
		// 이 크기를 이용하여 camera 객체를 생성하고 있다.
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		// 생성한 카메라 객체를 또 다른 method에서 사용할 수 있도록 this._camera라는 field로 정의하고있다.
		camera.position.z = 2;
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

	// 파란색 정육면체의 mesh를 생성하는 코드
	_setupModel() {
		// 정육면체의 형상을 정의 BoxGeometry는 3개의 인자값을 받는다. (가로, 세로, 깊이)
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		// 파란색 계열의 재질 생성
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

		//geometry객체와 material객체를 통해서 mesh가 생성된걸 cube상수에 담김
		const cube = new THREE.Mesh(geometry, material);

		// cube는 scene 객체의 구성요소로 추가
		this._scene.add(cube);
		// cube는 또 다른 method에서 참조될 수있도록 this._cube로 field화된다.
		this._cube = cube;
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
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
		//time 값은 requestAnimationFrame 함수가 render 함수에 전달해주는 값이다.
	}
}

//App이라는 class 정의
window.onload = function () {
	new App();
};
//window에 onload에서 App 클래스를 생성해주고있다.
