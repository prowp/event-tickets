<?php

namespace Tribe\Tickets\Partials\V2\Components\Loader;

use Codeception\TestCase\WPTestCase;
use Spatie\Snapshots\MatchesSnapshots;
use tad\WP\Snapshots\WPHtmlOutputDriver;

class LoaderTest extends WPTestCase {

	use MatchesSnapshots;

	protected $partial_path = 'v2/components/loader/loader';

	/**
	 * @test
	 */
	public function test_should_render_loader() {

		$template = tribe( 'tickets.editor.template' );
		$html     = $template->template( $this->partial_path, [ 'classes' => [] ], false );
		$driver   = new WPHtmlOutputDriver( home_url(), 'http://test.tribe.dev' );

		$this->assertMatchesSnapshot( $html, $driver );
	}

	/**
	 * @test
	 */
	public function test_should_render_loader_with_custom_classes() {

		$template = tribe( 'tickets.editor.template' );
		$html     = $template->template( $this->partial_path, [ 'classes' => [ 'css-test-class' ] ], false );
		$driver   = new WPHtmlOutputDriver( home_url(), 'http://test.tribe.dev' );

		$this->assertMatchesSnapshot( $html, $driver );
	}
}
