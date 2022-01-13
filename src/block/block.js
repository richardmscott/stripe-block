/**
 * BLOCK: stripe-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
import classNames from 'classnames';
import {
	InnerBlocks,
	withColors,
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	getColorClassName
} from '@wordpress/block-editor';

import { Icon,
    Panel,
    PanelBody,
	PanelRow,
    ToggleControl,
	SelectControl
} from '@wordpress/components'

const htmlElementMessages = {
	header: __(
		'The <header> element should represent introductory content, typically a group of introductory or navigational aids.'
	),
	main: __(
		'The <main> element should be used for the primary content of your document only. '
	),
	section: __(
		"The <section> element should represent a standalone portion of the document that can't be better represented by another element."
	),
	article: __(
		'The <article> element should represent a self contained, syndicatable portion of the document.'
	),
	aside: __(
		"The <aside> element should represent a portion of a document whose content is only indirectly related to the document's main content."
	),
	footer: __(
		'The <footer> element should represent a footer for its nearest sectioning element (e.g.: <section>, <article>, <main> etc.).'
	),
};

/**
 *  The block is pull out as a constant so we can wrap in a higher order component
 */

const BlockWithColorSettings = ( props ) => {
	const {
		textColor,
        setTextColor,
        backgroundColor,
        setBackgroundColor,
		attributes: { hasPadding, tagName },
		setAttributes,
	} = props;

    const classes = classNames('alignfull', (backgroundColor != undefined ? backgroundColor.class : ''), (textColor != undefined ? textColor.class : ''), (hasPadding != false ? "has-padding" : ''));

    const blockProps = useBlockProps( {
        className: classes,
    } );

	const setHasPadding = ( newPadding ) => {
        setAttributes( {
            hasPadding: (hasPadding === true ? false : true),
        } );
    };

	const innerBlockTemplate = [
		[ 'cgb/content-media-block'],
	 ];

	 const TagName = tagName;

	return (
		<TagName { ...blockProps }>
	<InspectorControls>
    <Panel>
	<PanelBody
            title="Padding settings"
				>
    <ToggleControl
            label="Has vertical padding"
            help={
                hasPadding
                    ? 'Has vertical padding'
                    : 'No vertical padding'
            }
            checked={ hasPadding }
            onChange={ setHasPadding }
        />
        </PanelBody>
        <PanelColorSettings 
					title={__('Color settings')}
					colorSettings={[
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __('Text color')
						},
                        {
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __('Background color')
						},
					]}
				/>
			<PanelBody
            title="HMTL settings"
				>
				<SelectControl
					label={ __( 'HTML element' ) }
					options={ [
						{ label: __( 'Default (<section>)' ), value: 'section' },
						{ label: '<header>', value: 'header' },
						{ label: '<main>', value: 'main' },
						{ label: '<div>', value: 'div' },
						{ label: '<article>', value: 'article' },
						{ label: '<aside>', value: 'aside' },
						{ label: '<footer>', value: 'footer' },
					] }
					value={ TagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					help={ htmlElementMessages[ TagName ] }
				/>
			</PanelBody>
			</Panel>
			</InspectorControls>
		<div className={ props.className }>
			<div class="wp-block-stripe-block-inner">
			<InnerBlocks allowedBlocks={ ['core/heading', 'core/buttons', 'core/paragraph', 'core/media-text', 'cgb/content-media-block', 'acf/featuredpages' ] } template={ innerBlockTemplate } />
			</div>
		</div>
		</TagName>
	);
};

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-stripe-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Stripe Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	getEditWrapperProps( attributes ) {
        return { 'data-align': 'full' };
    },
	keywords: [
		__( 'stripe-block — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	getEditWrapperProps( attributes ) {
        return { 'data-align': 'full' };
    },
	attributes: {
		textColor: {
			type: 'string'
		},
        customTextColor: {
			type: 'string'
		},
		backgroundColor: {
			type: 'string'
		},
        customBackgroundColor: {
			type: 'string'
		},
		align: {
            type: 'string',
            default: 'full',
        },
		hasPadding: {
            type: 'boolean',
            default: 'true'
        },
		tagName: {
			type: 'string',
			default: 'section'
		}
	},
	supports: {
        align: false
    },

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: withColors({textColor: 'color', backgroundColor: 'background-color'})(BlockWithColorSettings),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( props ) => {

		const {
			attributes: {hasPadding, backgroundColor, textColor, tagName },
		} = props;

		let classes = classNames('alignfull', (backgroundColor != undefined ? getColorClassName('background-color', backgroundColor) : ''), (textColor != undefined ? getColorClassName('color', textColor) : ''), (hasPadding != false ? "has-padding" : ''));

        const blockProps = useBlockProps.save( {
            className: classes
        } );	

		const TagName = tagName;

		return (
			<TagName { ...blockProps }>
				<div class="wp-block-stripe-block-inner">
   				<InnerBlocks.Content />
				</div>
			</TagName>
		);
	},
} );